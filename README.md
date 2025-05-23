# Voice Timeline App

A modern web application that allows users to record and publish voice messages on an interactive timeline.

## Features

- **Voice Recording**: Record high-quality audio messages using your device's microphone
- **Interactive Timeline**: View and play back voice messages in a chronological timeline
- **Responsive Design**: Works seamlessly on both mobile and desktop devices
- **Modern UI**: Clean, intuitive interface with visual feedback during recording

## Technology Stack

- **React**: Frontend library for building user interfaces
- **Styled Components**: CSS-in-JS for component styling
- **Web Audio API**: For audio processing and visualization
- **MediaRecorder API**: For capturing audio from the user's microphone

## Project Structure

```
voice-timeline-app/
├── public/                      # Static assets
│   ├── index.html               # HTML entry point
│   └── favicon.ico              # App favicon
├── src/                         # Source code
│   ├── components/              # React components
│   │   ├── AudioPlayer/         # Audio playback components
│   │   ├── AudioRecorder/       # Recording functionality
│   │   ├── Timeline/            # Timeline display components
│   │   └── UI/                  # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   ├── context/                 # React context providers
│   ├── styles/                  # CSS/SCSS files
│   ├── utils/                   # Utility functions
│   ├── App.js                   # Main App component
│   └── index.js                 # JavaScript entry point
├── README.md                    # Project documentation
├── package.json                 # Dependencies and scripts
└── .gitignore                   # Git ignore file
```

## Audio Recording Implementation

The audio recording functionality is implemented using the Web Audio API and MediaRecorder API. Key components include:

### Components

- **AudioRecorder**: Main component for recording voice messages
- **AudioVisualizer**: Provides real-time visualization of audio levels
- **RecordingControls**: UI controls for recording actions

### Hooks

- **useAudioRecording**: Custom hook that manages recording state and microphone access

### Features

- Microphone permission management
- Recording, pausing, and stopping audio capture
- Visual feedback during recording (timer, audio level visualization)
- Audio preview before saving
- Error handling for unsupported browsers and permission issues

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/voice-timeline-app.git
cd voice-timeline-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Browser Compatibility

The application works best in modern browsers that support the MediaRecorder API:

- Chrome (version 47+)
- Firefox (version 25+)
- Edge (version 79+)
- Safari (with some limitations)

## License

This project is licensed under the MIT License - see the LICENSE file for details.