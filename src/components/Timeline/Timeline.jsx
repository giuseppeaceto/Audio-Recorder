import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { FaCalendarAlt, FaClock, FaTrash, FaMusic } from 'react-icons/fa';
import { useVoiceMessages } from '../../context/VoiceMessagesContext';

const TimelineContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const TimelineTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const TimelineList = styled.ul`
  list-style: none;
  padding: 0;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e0e0e0;
  }
`;

const TimelineItem = styled(motion.li)`
  position: relative;
  padding-left: 60px;
  margin-bottom: 30px;
  
  &:before {
    content: '';
    position: absolute;
    left: 14px;
    top: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #4a90e2;
    border: 2px solid white;
  }
`;

const MessageCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #666;
`;

const MessageDate = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
`;

const MessageTime = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
`;

const MessageTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: #4a90e2;
  }
`;

const MessageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(231, 76, 60, 0.1);
  }
  
  svg {
    margin-right: 5px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 15px;
`;

const EmptyStateText = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const EmptyStateSubtext = styled.p`
  color: #999;
  font-size: 0.9rem;
`;

const SortingOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`;

const SortButton = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(74, 144, 226, 0.1);
  }
  
  &.active {
    font-weight: bold;
    background-color: rgba(74, 144, 226, 0.1);
  }
`;

const MessageDuration = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
  
  svg {
    margin-right: 5px;
    color: #4a90e2;
  }
`;

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
};

const Timeline = () => {
  const { messages, deleteMessage } = useVoiceMessages();
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDelete = (id) => {
    // If the message being deleted is currently playing, reset the currently playing state
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    }
    deleteMessage(id);
  };

  const handlePlayStart = (id) => {
    setCurrentlyPlaying(id);
  };

  const handlePlayEnd = () => {
    setCurrentlyPlaying(null);
  };

  // Sort messages based on the current sort order
  const sortedMessages = [...messages].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.timestamp - a.timestamp;
    } else {
      return a.timestamp - b.timestamp;
    }
  });

  return (
    <TimelineContainer>
      <TimelineTitle>Voice Message Timeline</TimelineTitle>
      
      {messages.length > 0 && (
        <SortingOptions>
          <SortButton 
            className={sortOrder === 'newest' ? 'active' : ''}
            onClick={() => setSortOrder('newest')}
          >
            Newest First
          </SortButton>
          <SortButton 
            className={sortOrder === 'oldest' ? 'active' : ''}
            onClick={() => setSortOrder('oldest')}
          >
            Oldest First
          </SortButton>
        </SortingOptions>
      )}
      
      {messages.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <FaMusic />
          </EmptyStateIcon>
          <EmptyStateText>No voice messages yet</EmptyStateText>
          <EmptyStateSubtext>Click the "Record New Message" button to create your first voice message</EmptyStateSubtext>
        </EmptyState>
      ) : (
        <TimelineList>
          <AnimatePresence>
            {sortedMessages.map((message) => (
              <TimelineItem
                key={message.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <MessageCard>
                  <MessageHeader>
                    <MessageDate>
                      <FaCalendarAlt /> {formatDate(message.timestamp)}
                    </MessageDate>
                    <MessageTime>
                      <FaClock /> {formatTime(message.timestamp)}
                    </MessageTime>
                  </MessageHeader>
                  <MessageTitle>
                    <FaMusic /> {message.title || `Voice Message`}
                  </MessageTitle>
                  {message.duration && (
                    <MessageDuration>
                      <FaClock /> Duration: {formatDuration(message.duration)}
                    </MessageDuration>
                  )}
                  <AudioPlayer 
                    audioBlob={message.audioBlob} 
                    onPlayStart={() => handlePlayStart(message.id)}
                    onPlayEnd={handlePlayEnd}
                    isPlaying={currentlyPlaying === message.id}
                  />
                  <MessageActions>
                    <DeleteButton onClick={() => handleDelete(message.id)}>
                      <FaTrash /> Delete
                    </DeleteButton>
                  </MessageActions>
                </MessageCard>
              </TimelineItem>
            ))}
          </AnimatePresence>
        </TimelineList>
      )}
    </TimelineContainer>
  );
};

export default Timeline;