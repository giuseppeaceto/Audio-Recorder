# Timeline Component

The Timeline component displays recorded voice messages chronologically and allows users to interact with them.

## Features

- Chronological display of voice messages (newest first by default)
- Sorting options (newest or oldest first)
- Playback of voice messages using the AudioPlayer component
- Delete functionality for removing messages
- Smooth animations for adding/removing messages
- Empty state handling with helpful guidance
- Visual feedback for user interactions

## Usage

```jsx
import Timeline from './components/Timeline/Timeline';
import { VoiceMessagesProvider } from './context/VoiceMessagesContext';

// The Timeline component automatically connects to the VoiceMessagesContext
// to retrieve and manage voice messages
const App = () => {
  return (
    <VoiceMessagesProvider>
      <Timeline />
    </VoiceMessagesProvider>
  );
};
```

## Props

The Timeline component doesn't require any props as it retrieves messages directly from the VoiceMessagesContext.

## Message Structure

Each voice message in the timeline has the following structure:

```js
{
  id: string,           // Unique identifier
  audioBlob: Blob,      // Audio data as a Blob
  title: string,        // Optional title for the message
  timestamp: number,    // Creation timestamp (milliseconds)
  duration: number      // Duration of the recording in seconds (optional)
}
```

## Dependencies

- React
- styled-components
- framer-motion (for animations)
- react-icons
- VoiceMessagesContext (for state management)
- AudioPlayer component (for playback functionality)

## Implementation Details

### Key Features

1. **Message Display**
   - Each message shows timestamp, title, and duration
   - Integrates AudioPlayer for playback

2. **Delete Functionality**
   - Each message has a delete button
   - Confirms deletion with visual feedback
   - Removes message from context/storage

3. **Sorting**
   - Default: newest messages at the top
   - Toggle between newest and oldest first

4. **Empty State**
   - Displays helpful message when no recordings exist
   - Provides guidance on creating the first recording

5. **Animations**
   - Smooth entry/exit animations using framer-motion
   - Visual feedback for user interactions