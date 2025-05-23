import React from 'react';
import styled from 'styled-components';
import { FaMicrophone, FaStop, FaPause, FaPlay, FaTrash, FaSave } from 'react-icons/fa';
import Button from '../UI/Button';

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
  width: 100%;
  flex-wrap: wrap;
`;

const RecordButton = styled(Button)`
  background-color: ${props => props.isRecording ? '#e74c3c' : '#4a90e2'};
  
  &:hover {
    background-color: ${props => props.isRecording ? '#c0392b' : '#2a6fc9'};
  }
`;

const RecordingControls = ({ 
  isRecording, 
  isPaused,
  onStart, 
  onStop, 
  onPause,
  onResume,
  onCancel,
  onSave,
  hasRecording,
  disabled
}) => {
  return (
    <ControlsContainer>
      {!isRecording && !hasRecording && (
        <RecordButton 
          primary 
          icon={<FaMicrophone />} 
          onClick={onStart}
          disabled={disabled}
          isRecording={false}
        >
          Start Recording
        </RecordButton>
      )}
      
      {isRecording && (
        <>
          <RecordButton 
            primary 
            icon={<FaStop />} 
            onClick={onStop}
            isRecording={true}
          >
            Stop
          </RecordButton>
          
          {isPaused ? (
            <Button 
              icon={<FaPlay />} 
              onClick={onResume}
            >
              Resume
            </Button>
          ) : (
            <Button 
              icon={<FaPause />} 
              onClick={onPause}
            >
              Pause
            </Button>
          )}
          
          <Button 
            icon={<FaTrash />} 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </>
      )}
      
      {hasRecording && !isRecording && (
        <>
          <Button 
            primary
            icon={<FaSave />} 
            onClick={onSave}
          >
            Save Recording
          </Button>
          
          <Button 
            icon={<FaTrash />} 
            onClick={onCancel}
          >
            Discard
          </Button>
          
          <Button 
            icon={<FaMicrophone />} 
            onClick={onStart}
          >
            Record Again
          </Button>
        </>
      )}
    </ControlsContainer>
  );
};

export default RecordingControls;