/**
 * Test utility for audio recording functionality
 * This file contains functions to test various aspects of the audio recording implementation
 */

/**
 * Tests browser support for audio recording
 * @returns {Object} Object containing support information
 */
export const testBrowserSupport = () => {
  const results = {
    mediaDevices: !!navigator.mediaDevices,
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    mediaRecorder: !!window.MediaRecorder,
    audioContext: !!(window.AudioContext || window.webkitAudioContext),
    supportedMimeTypes: []
  };
  
  // Test supported MIME types
  if (window.MediaRecorder) {
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/mpeg',
      'audio/wav'
    ];
    
    results.supportedMimeTypes = types.filter(type => MediaRecorder.isTypeSupported(type));
  }
  
  return results;
};

/**
 * Tests microphone access
 * @returns {Promise<Object>} Promise resolving to test results
 */
export const testMicrophoneAccess = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Get audio tracks information
    const audioTracks = stream.getAudioTracks();
    const trackInfo = audioTracks.map(track => ({
      id: track.id,
      label: track.label,
      enabled: track.enabled,
      muted: track.muted,
      readyState: track.readyState,
      constraints: track.getConstraints()
    }));
    
    // Stop the stream after testing
    stream.getTracks().forEach(track => track.stop());
    
    return {
      success: true,
      trackCount: audioTracks.length,
      tracks: trackInfo
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Unknown error',
      name: error.name,
      constraint: error.constraint
    };
  }
};

/**
 * Tests audio recording capabilities
 * @param {number} duration - Duration to record in milliseconds
 * @returns {Promise<Object>} Promise resolving to test results
 */
export const testRecording = async (duration = 3000) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    return new Promise((resolve, reject) => {
      try {
        // Get best MIME type
        const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/ogg';
        
        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        const audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: mimeType });
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          resolve({
            success: true,
            blob: audioBlob,
            size: audioBlob.size,
            type: audioBlob.type,
            chunks: audioChunks.length,
            url: URL.createObjectURL(audioBlob)
          });
        };
        
        mediaRecorder.onerror = (event) => {
          reject({
            success: false,
            error: event.error.message || 'Recording error'
          });
        };
        
        // Start recording
        mediaRecorder.start();
        
        // Stop after specified duration
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }, duration);
      } catch (error) {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        reject({
          success: false,
          error: error.message || 'Error during recording test'
        });
      }
    });
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to access microphone',
      name: error.name
    };
  }
};

/**
 * Run all tests and return comprehensive results
 * @returns {Promise<Object>} Promise resolving to all test results
 */
export const runAllTests = async () => {
  const supportResults = testBrowserSupport();
  
  // Only proceed with other tests if basic support is available
  if (!supportResults.mediaDevices || !supportResults.getUserMedia || !supportResults.mediaRecorder) {
    return {
      browserSupport: supportResults,
      microphoneAccess: { success: false, error: 'Browser does not support required APIs' },
      recording: { success: false, error: 'Browser does not support required APIs' }
    };
  }
  
  const microphoneResults = await testMicrophoneAccess();
  
  // Only test recording if microphone access succeeded
  let recordingResults = { success: false, error: 'Microphone access failed' };
  if (microphoneResults.success) {
    recordingResults = await testRecording();
  }
  
  return {
    browserSupport: supportResults,
    microphoneAccess: microphoneResults,
    recording: recordingResults
  };
};

// Export a function to run tests and log results
export const logTestResults = async () => {
  console.log('Running audio recording tests...');
  const results = await runAllTests();
  console.log('Test results:', results);
  return results;
};