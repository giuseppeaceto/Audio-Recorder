import React, { useState } from 'react';
import styled from 'styled-components';
import AudioRecorder from './components/AudioRecorder/AudioRecorder';
import Timeline from './components/Timeline/Timeline';
import Button from './components/UI/Button';
import { VoiceMessagesProvider, useVoiceMessages } from './context/VoiceMessagesContext';
import { FaMicrophone, FaPlus } from 'react-icons/fa';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const RecordingSection = styled.section`
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const AppContent = () => {
  const { messages, addMessage } = useVoiceMessages();
  const [showRecorder, setShowRecorder] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState('');

  const handleRecordingComplete = (blob, duration) => {
    // Add the voice message to the context with duration information
    addMessage(blob, recordingTitle || `Voice Message ${messages.length + 1}`, duration);
    
    // Reset state
    setShowRecorder(false);
    setRecordingTitle('');
  };

  return (
    <AppContainer>
      <Header>
        <Title>Voice Timeline</Title>
        <Subtitle>Record and share your voice messages on a timeline</Subtitle>
      </Header>

      <MainContent>
        {showRecorder ? (
          <RecordingSection>
            <TitleInput
              type="text"
              placeholder="Message title (optional)"
              value={recordingTitle}
              onChange={(e) => setRecordingTitle(e.target.value)}
              aria-label="Message title"
            />
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            <ButtonContainer>
              <Button onClick={() => setShowRecorder(false)}>Cancel</Button>
            </ButtonContainer>
          </RecordingSection>
        ) : (
          <ButtonContainer>
            <Button 
              primary 
              icon={<FaMicrophone />} 
              onClick={() => setShowRecorder(true)}
            >
              Record New Message
            </Button>
          </ButtonContainer>
        )}

        <Timeline />
      </MainContent>
    </AppContainer>
  );
};

const App = () => {
  return (
    <VoiceMessagesProvider>
      <AppContent />
    </VoiceMessagesProvider>
  );
};

export default App;