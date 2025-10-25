# YouTube Channel Auto Player

A React-based web application that allows users to automatically play videos from any YouTube channel. The app fetches videos from a specified YouTube channel and plays them sequentially with auto-play functionality.

## Features

- **YouTube API Integration**: Enter your YouTube API key to access channel data
- **Channel URL Support**: Supports various YouTube channel URL formats:
  - Channel ID: `https://www.youtube.com/channel/CHANNEL_ID`
  - Username: `https://www.youtube.com/user/USERNAME`
  - Custom URL: `https://www.youtube.com/c/CUSTOM_NAME`
  - Handle: `https://www.youtube.com/@HANDLE`
- **Video Filtering**: Filter videos by:
  - All Videos
  - Long Videos (5+ minutes)
  - Shorts (under 5 minutes)
- **Auto-Play**: Automatically plays the next video when the current one ends
- **Video Player**: Built-in YouTube video player with controls
- **Responsive Design**: Modern, clean UI that works on all devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- YouTube Data API v3 key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/srujan5570/youtube-video-play-auto.git
   cd youtube-video-play-auto
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

To create a production build:

```bash
npm run build
```

To serve the production build locally:

```bash
npm install -g serve
serve -s build
```

## How to Use

1. **Get a YouTube API Key**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the YouTube Data API v3
   - Create credentials (API key)
   - Copy the API key

2. **Enter API Key**: Paste your YouTube API key in the input field and click "Submit"

3. **Enter Channel URL**: Enter any YouTube channel URL in the supported formats

4. **Load Videos**: Click "Load Videos" to fetch the channel's videos

5. **Filter and Play**: Use the filter buttons to show specific types of videos, then click on any video to start playing

## Technologies Used

- **React**: Frontend framework
- **Axios**: HTTP client for API requests
- **react-youtube**: YouTube player component
- **YouTube Data API v3**: For fetching channel and video data
- **CSS3**: Styling and responsive design

## API Usage

This application uses the YouTube Data API v3 to:
- Fetch channel information
- Get channel's upload playlist
- Retrieve video details including duration and thumbnails

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- YouTube Data API v3 for providing access to YouTube data
- React community for the excellent documentation and resources
- react-youtube library for the YouTube player integration