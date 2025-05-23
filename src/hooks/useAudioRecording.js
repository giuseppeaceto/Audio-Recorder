import { useState, useRef, useEffect } from 'react';
import { 
  formatAudioTime, 
  isAudioRecordingSupported, 
  getAudioLevel,
  getBestSupportedMimeType
} from '../utils/audioUtils';

const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [recordingError, setRecordingError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied'
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Check for browser support
  const isSupported = () => {
    return isAudioRecordingSupported();
  };

  // Request microphone permissions without starting recording
  const requestPermission = async () => {
    if (!isSupported()) {
      setRecordingError('Your browser does not support audio recording');
      setPermissionStatus('denied');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately since we're just checking permissions
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
      setRecordingError(null);
      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setRecordingError(error.message || 'Failed to access microphone');
      setPermissionStatus('denied');
      return false;
    }
  };

  // Set up audio visualization
  const setupAudioVisualization = (stream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    
    analyserRef.current = analyser;
    
    // Start monitoring audio levels
    const updateAudioLevel = () => {
      if (analyserRef.current && isRecording) {
        const level = getAudioLevel(analyserRef.current);
        setAudioLevel(level);
        
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };
    
    updateAudioLevel();
  };

  // Start recording
  const startRecording = async () => {
    if (isRecording) return;
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;
      
      // Set up audio visualization
      setupAudioVisualization(stream);
      
      // Get the best supported MIME type
      const mimeType = getBestSupportedMimeType() || 'audio/webm';
      
      // Create MediaRecorder instance
      const options = { mimeType };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];
      
      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stop event
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordingBlob(audioBlob);
        
        // Stop all audio tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Cancel animation frame
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        
        setIsRecording(false);
      };
      
      // Handle recording error
      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setRecordingError(`Recording error: ${event.error.message || 'Unknown error'}`);
        
        // Stop recording on error
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      };
      
      // Start recording
      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingError(null);
      setRecordingTime(0);
      setPermissionStatus('granted');
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingError(error.message || 'Failed to start recording');
      setPermissionStatus('denied');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Pause recording (if supported)
  const pauseRecording = () => {
    if (mediaRecorderRef.current && 
        isRecording && 
        mediaRecorderRef.current.state === 'recording' &&
        typeof mediaRecorderRef.current.pause === 'function') {
      mediaRecorderRef.current.pause();
    }
  };

  // Resume recording (if supported)
  const resumeRecording = () => {
    if (mediaRecorderRef.current && 
        mediaRecorderRef.current.state === 'paused' &&
        typeof mediaRecorderRef.current.resume === 'function') {
      mediaRecorderRef.current.resume();
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop the media recorder
      mediaRecorderRef.current.stop();
      
      // Clear the recording blob
      setRecordingBlob(null);
    }
  };

  // Clear recording
  const clearRecording = () => {
    setRecordingBlob(null);
  };

  // Format recording time
  const formattedTime = formatAudioTime(recordingTime);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
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
  };
};

export default useAudioRecording;