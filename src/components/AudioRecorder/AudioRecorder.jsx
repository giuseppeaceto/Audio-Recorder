import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMicrophone } from 'react-icons/fa';
import Button from '../UI/Button';
import AudioVisualizer from './AudioVisualizer';
import RecordingControls from './RecordingControls';
import useAudioRecording from '../../hooks/useAudioRecording';
import { useVoiceMessages } from '../../context/VoiceMessagesContext';

const RecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  width: 100%;
`;

const RecorderTitle = styled.h2`
  margin-bottom: 15px;
  color: #333;
`;

const RecordingStatus = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: ${props => props.isRecording ? '#e74c3c' : '#333'};
  font-weight: ${props => props.isRecording ? 'bold' : 'normal'};
`;

const RecordingIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.isRecording ? '#e74c3c' : '#ccc'};
  margin-right: 8px;
  animation: ${props => props.isRecording ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 1;
    }
  }
`;

const RecordingTime = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 10px 0;
  font-family: monospace;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  background-color: rgba(231, 76, 60, 0.1);
  width: 100%;
  text-align: center;
`;

const PermissionPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
`;

const AudioPreview = styled.div`
  width: 100%;
  margin: 15px 0;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f5f5;
`;

const AudioRecorder = ({ onRecordingComplete }) => {
  const {
    isRecording,
    recordingBlob,
    recordingError,
    recordingTime,
    formattedTime,
    audioLevel,
    permissionStatus,
    isSupported,
    requestPermission,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    clearRecording
  } = useAudioRecording();

  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Check browser support and request permissions on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      if (permissionStatus === 'prompt') {
        await requestPermission();
      }
      setIsReady(true);
    };
    
    checkPermissions();
    
    // Clean up any created object URLs
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  // Create preview URL when recording blob is available
  useEffect(() => {
    if (recordingBlob) {
      // Revoke previous URL if it exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create new URL for the blob
      const url = URL.createObjectURL(recordingBlob);
      setPreviewUrl(url);
    } else {
      // Clear preview URL if no blob
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [recordingBlob]);

  const handleStartRecording = () => {
    setIsPaused(false);
    startRecording();
  };

  const handleStopRecording = () => {
    setIsPaused(false);
    stopRecording();
  };

  const handlePauseRecording = () => {
    setIsPaused(true);
    pauseRecording();
  };

  const handleResumeRecording = () => {
    setIsPaused(false);
    resumeRecording();
  };

  const handleCancelRecording = () => {
    setIsPaused(false);
    cancelRecording();
  };

  const handleSaveRecording = () => {
    if (recordingBlob && onRecordingComplete) {
      // Pass the recording blob and duration to the parent component
      onRecordingComplete(recordingBlob, recordingTime);
      clearRecording();
    }
  };

  // Render permission request UI if needed
  if (permissionStatus === 'denied') {
    return (
      <RecorderContainer>
        <RecorderTitle>Microphone Access Required</RecorderTitle>
        <ErrorMessage>
          Please allow microphone access to record voice messages.
          You may need to update your browser settings to grant permission.
        </ErrorMessage>
        <Button onClick={() => requestPermission()}>
          Try Again
        </Button>
      </RecorderContainer>
    );
  }

  // Render unsupported browser message if needed
  if (!isSupported()) {
    return (
      <RecorderContainer>
        <RecorderTitle>Browser Not Supported</RecorderTitle>
        <ErrorMessage>
          Your browser does not support audio recording.
          Please try using a modern browser like Chrome, Firefox, or Edge.
        </ErrorMessage>
      </RecorderContainer>
    );
  }

  return (
    <RecorderContainer>
      <RecorderTitle>Record Voice Message</RecorderTitle>
      
      {recordingError && (
        <ErrorMessage>{recordingError}</ErrorMessage>
      )}
      
      <RecordingStatus isRecording={isRecording}>
        <RecordingIndicator isRecording={isRecording} />
        {isRecording 
          ? isPaused 
            ? 'Recording paused' 
            : 'Recording in progress' 
          : recordingBlob 
            ? 'Recording complete' 
            : 'Ready to record'
        }
      </RecordingStatus>
      
      {(isRecording || recordingTime > 0) && (
        <RecordingTime>{formattedTime}</RecordingTime>
      )}
      
      <AudioVisualizer 
        audioLevel={audioLevel} 
        isRecording={isRecording && !isPaused} 
      />
      
      {recordingBlob && !isRecording && (
        <AudioPreview>
          <audio 
            src={previewUrl} 
            controls 
            style={{ width: '100%' }}
          />
        </AudioPreview>
      )}
      
      <RecordingControls 
        isRecording={isRecording}
        isPaused={isPaused}
        hasRecording={!!recordingBlob}
        disabled={!isReady}
        onStart={handleStartRecording}
        onStop={handleStopRecording}
        onPause={handlePauseRecording}
        onResume={handleResumeRecording}
        onCancel={handleCancelRecording}
        onSave={handleSaveRecording}
      />
    </RecorderContainer>
  );
};

export default AudioRecorder;