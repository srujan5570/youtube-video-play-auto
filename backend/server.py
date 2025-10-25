from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx
import re


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ChannelRequest(BaseModel):
    channel_url: str
    api_key: str

class VideoItem(BaseModel):
    video_id: str
    title: str
    thumbnail: str
    duration: str
    published_at: str
    is_short: bool

class ChannelVideosResponse(BaseModel):
    videos: List[VideoItem]
    channel_name: str
    channel_thumbnail: str


# Helper functions
def extract_channel_id(url: str) -> Optional[str]:
    """Extract channel ID or username from YouTube URL"""
    patterns = [
        r'youtube\.com/channel/([^/?]+)',
        r'youtube\.com/c/([^/?]+)',
        r'youtube\.com/@([^/?]+)',
        r'youtube\.com/user/([^/?]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def parse_duration(duration: str) -> int:
    """Parse ISO 8601 duration to seconds"""
    import re
    pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
    match = re.match(pattern, duration)
    if not match:
        return 0
    
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    
    return hours * 3600 + minutes * 60 + seconds

def format_duration(seconds: int) -> str:
    """Format seconds to HH:MM:SS or MM:SS"""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    
    if hours > 0:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes}:{secs:02d}"

async def get_channel_id_from_handle(handle: str, api_key: str) -> Optional[str]:
    """Get channel ID from handle/username"""
    async with httpx.AsyncClient() as client:
        # Try search API
        search_url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "q": handle,
            "type": "channel",
            "maxResults": 1,
            "key": api_key
        }
        
        try:
            response = await client.get(search_url, params=params)
            if response.status_code == 200:
                data = response.json()
                if data.get("items"):
                    return data["items"][0]["id"]["channelId"]
        except Exception:
            pass
    return None


# Add your routes to the router
@api_router.get("/")
async def root():
    return {"message": "YouTube Channel Video Player API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/fetch-channel-videos", response_model=ChannelVideosResponse)
async def fetch_channel_videos(request: ChannelRequest):
    """Fetch all videos from a YouTube channel"""
    try:
        channel_identifier = extract_channel_id(request.channel_url)
        if not channel_identifier:
            raise HTTPException(status_code=400, detail="Invalid YouTube channel URL")
        
        # Determine if it's a channel ID or handle
        is_channel_id = channel_identifier.startswith("UC")
        
        channel_id = channel_identifier
        if not is_channel_id:
            # Get channel ID from handle
            channel_id = await get_channel_id_from_handle(channel_identifier, request.api_key)
            if not channel_id:
                raise HTTPException(status_code=404, detail="Channel not found")
        
        async with httpx.AsyncClient() as client:
            # Get channel details
            channel_url = "https://www.googleapis.com/youtube/v3/channels"
            channel_params = {
                "part": "snippet,contentDetails",
                "id": channel_id,
                "key": request.api_key
            }
            
            channel_response = await client.get(channel_url, params=channel_params)
            if channel_response.status_code != 200:
                error_data = channel_response.json()
                raise HTTPException(
                    status_code=channel_response.status_code,
                    detail=error_data.get("error", {}).get("message", "Failed to fetch channel data")
                )
            
            channel_data = channel_response.json()
            if not channel_data.get("items"):
                raise HTTPException(status_code=404, detail="Channel not found")
            
            channel_info = channel_data["items"][0]
            channel_name = channel_info["snippet"]["title"]
            channel_thumbnail = channel_info["snippet"]["thumbnails"]["default"]["url"]
            uploads_playlist_id = channel_info["contentDetails"]["relatedPlaylists"]["uploads"]
            
            # Fetch all videos from uploads playlist
            all_video_ids = []
            next_page_token = None
            
            while True:
                playlist_url = "https://www.googleapis.com/youtube/v3/playlistItems"
                playlist_params = {
                    "part": "contentDetails",
                    "playlistId": uploads_playlist_id,
                    "maxResults": 50,
                    "key": request.api_key
                }
                
                if next_page_token:
                    playlist_params["pageToken"] = next_page_token
                
                playlist_response = await client.get(playlist_url, params=playlist_params)
                if playlist_response.status_code != 200:
                    break
                
                playlist_data = playlist_response.json()
                video_ids = [item["contentDetails"]["videoId"] for item in playlist_data.get("items", [])]
                all_video_ids.extend(video_ids)
                
                next_page_token = playlist_data.get("nextPageToken")
                if not next_page_token:
                    break
            
            if not all_video_ids:
                return ChannelVideosResponse(
                    videos=[],
                    channel_name=channel_name,
                    channel_thumbnail=channel_thumbnail
                )
            
            # Get video details in batches of 50
            videos = []
            for i in range(0, len(all_video_ids), 50):
                batch_ids = all_video_ids[i:i+50]
                video_url = "https://www.googleapis.com/youtube/v3/videos"
                video_params = {
                    "part": "snippet,contentDetails",
                    "id": ",".join(batch_ids),
                    "key": request.api_key
                }
                
                video_response = await client.get(video_url, params=video_params)
                if video_response.status_code != 200:
                    continue
                
                video_data = video_response.json()
                for item in video_data.get("items", []):
                    duration_seconds = parse_duration(item["contentDetails"]["duration"])
                    is_short = duration_seconds > 0 and duration_seconds <= 60
                    
                    videos.append(VideoItem(
                        video_id=item["id"],
                        title=item["snippet"]["title"],
                        thumbnail=item["snippet"]["thumbnails"]["medium"]["url"],
                        duration=format_duration(duration_seconds),
                        published_at=item["snippet"]["publishedAt"],
                        is_short=is_short
                    ))
            
            return ChannelVideosResponse(
                videos=videos,
                channel_name=channel_name,
                channel_thumbnail=channel_thumbnail
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching channel videos: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()