/**
 * Converts audio blob to base64 string for storage
 * @param {Blob} audioBlob - The audio blob to convert
 * @returns {Promise<string>} - Promise resolving to base64 string
 */
export const blobToBase64 = (audioBlob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
};

/**
 * Converts base64 string back to audio blob
 * @param {string} base64String - The base64 string to convert
 * @returns {Blob} - Audio blob
 */
export const base64ToBlob = (base64String) => {
  const parts = base64String.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

/**
 * Formats audio duration in seconds to MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted time string
 */
export const formatAudioTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Generates a waveform visualization from audio data
 * @param {AudioBuffer} audioBuffer - The audio buffer to visualize
 * @param {number} width - Width of the visualization
 * @param {number} height - Height of the visualization
 * @returns {Array} - Array of points for visualization
 */
export const generateWaveformData = (audioBuffer, width = 100, height = 50) => {
  const channelData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(channelData.length / width);
  const dataPoints = [];

  for (let i = 0; i < width; i++) {
    let blockStart = blockSize * i;
    let sum = 0;
    
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(channelData[blockStart + j]);
    }
    
    // Normalize and scale to the desired height
    const average = sum / blockSize;
    const scaledAverage = average * height;
    
    dataPoints.push(scaledAverage);
  }

  return dataPoints;
};

/**
 * Checks if the browser supports audio recording
 * @returns {boolean} - Whether audio recording is supported
 */
export const isAudioRecordingSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * Creates an audio buffer from a blob
 * @param {Blob} audioBlob - The audio blob
 * @param {AudioContext} audioContext - The audio context
 * @returns {Promise<AudioBuffer>} - Promise resolving to audio buffer
 */
export const createAudioBufferFromBlob = async (audioBlob, audioContext) => {
  const arrayBuffer = await audioBlob.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
};

/**
 * Gets the MIME types supported by the browser's MediaRecorder
 * @returns {Array<string>} - Array of supported MIME types
 */
export const getSupportedMimeTypes = () => {
  const types = [
    'audio/webm',
    'audio/webm;codecs=opus',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/mpeg',
    'audio/wav'
  ];
  
  if (!window.MediaRecorder) {
    return [];
  }
  
  return types.filter(type => MediaRecorder.isTypeSupported(type));
};

/**
 * Gets the best supported MIME type for audio recording
 * @returns {string|null} - Best supported MIME type or null if none supported
 */
export const getBestSupportedMimeType = () => {
  const supportedTypes = getSupportedMimeTypes();
  return supportedTypes.length > 0 ? supportedTypes[0] : null;
};

/**
 * Calculates the audio level from an analyzer node
 * @param {AnalyserNode} analyser - Web Audio API analyzer node
 * @returns {number} - Audio level between 0 and 1
 */
export const getAudioLevel = (analyser) => {
  if (!analyser) return 0;
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  
  // Calculate average volume level
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  
  const average = sum / dataArray.length;
  return average / 255; // Normalize to 0-1 range
};