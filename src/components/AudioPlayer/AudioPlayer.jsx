import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause } from 'react-icons/fa';

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #4a90e2;
  font-size: 1.2rem;
  margin-right: 10px;
  
  &:hover {
    color: #2a6fc9;
  }
`;

const ProgressBar = styled.div`
  flex-grow: 1;
  height: 6px;
  background-color: #ddd;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #4a90e2;
  border-radius: 3px;
  width: ${props => props.width}%;
`;

const TimeDisplay = styled.span`
  margin-left: 10px;
  font-size: 0.8rem;
  color: #666;
`;

const AudioPlayer = ({ 
  audioBlob, 
  onPlayStart = () => {}, 
  onPlayEnd = () => {},
  isPlaying: externalIsPlaying = null
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  
  const audioRef = useRef(null);
  const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

  // Handle external control of play state
  useEffect(() => {
    if (externalIsPlaying !== null) {
      if (externalIsPlaying && !isPlaying && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      } else if (!externalIsPlaying && isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [externalIsPlaying, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPlayEnd();
      } else {
        // Notify parent that this player is starting
        onPlayStart();
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(formatTime(audioRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('0:00');
    onPlayEnd();
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      audioRef.current.currentTime = clickPosition * audioRef.current.duration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up audio URL object when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <PlayerContainer>
      <PlayButton onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </PlayButton>
      <ProgressBar onClick={handleProgressClick}>
        <Progress width={progress} />
      </ProgressBar>
      <TimeDisplay>{currentTime} / {duration}</TimeDisplay>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}
    </PlayerContainer>
  );
};

export default AudioPlayer;