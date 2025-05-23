# AudioRecorder Component

The AudioRecorder component provides a complete audio recording experience for the Voice Timeline application. It allows users to record, pause, resume, preview, and save voice messages.

## Features

- **Microphone Access Management**: Handles permission requests and displays appropriate UI for denied permissions
- **Recording Controls**: Start, stop, pause, resume, and cancel recording
- **Visual Feedback**: Shows recording status, elapsed time, and audio level visualization
- **Audio Preview**: Allows users to listen to their recording before saving
- **Error Handling**: Gracefully handles recording errors and unsupported browsers
- **Responsive Design**: Works well on both mobile and desktop devices

## Component Structure

The AudioRecorder component is built using several sub-components:

1. **AudioRecorder.jsx**: Main component that orchestrates the recording experience
2. **AudioVisualizer.jsx**: Provides real-time visualization of audio levels during recording
3. **RecordingControls.jsx**: Manages the UI controls for recording actions

## Usage

```jsx
import AudioRecorder from './components/AudioRecorder/AudioRecorder';

const MyComponent = () => {
  const handleRecordingComplete = (audioBlob) => {
    // Do something with the recorded audio blob
    console.log('Recording complete:', audioBlob);
  };

  return (
    <AudioRecorder onRecordingComplete={handleRecordingComplete} />
  );
};
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `onRecordingComplete` | Function | Callback function that receives the final audio blob when recording is complete |

## Dependencies

- React hooks for state management
- Web Audio API for audio processing
- MediaRecorder API for capturing audio
- Custom `useAudioRecording` hook for recording logic
- Styled-components for styling
- React-icons for UI elements

## Browser Compatibility

The component checks for browser compatibility and provides appropriate feedback for unsupported browsers. It works best in:

- Chrome (version 47+)
- Firefox (version 25+)
- Edge (version 79+)
- Safari (with some limitations)

## Implementation Details

The recording functionality is implemented using the MediaRecorder API, which provides a straightforward way to capture audio from the user's microphone. The component handles the following aspects:

1. **Permission Management**: Requests microphone access and handles permission states
2. **Recording State**: Manages recording, paused, and stopped states
3. **Audio Visualization**: Processes audio data to visualize recording levels
4. **Error Handling**: Gracefully handles various error conditions
5. **Preview Generation**: Creates audio previews for user review before saving

## Future Improvements

- Add support for recording quality options
- Implement waveform visualization for recorded audio
- Add noise reduction and audio enhancement features
- Support for longer recordings with chunked storage