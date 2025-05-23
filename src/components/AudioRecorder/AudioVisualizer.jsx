import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const VisualizerContainer = styled.div`
  width: 100%;
  height: 60px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VisualizerCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const AudioVisualizer = ({ audioLevel, isRecording }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Store previous audio levels for smoother visualization
  const audioLevelsRef = useRef(Array(50).fill(0));
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Function to draw the visualizer
    const drawVisualizer = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update audio levels array
      if (isRecording) {
        audioLevelsRef.current.shift();
        audioLevelsRef.current.push(audioLevel);
      }
      
      // Draw the visualization
      const barWidth = width / audioLevelsRef.current.length;
      
      ctx.fillStyle = '#4a90e2';
      
      audioLevelsRef.current.forEach((level, index) => {
        const x = index * barWidth;
        const barHeight = level * height * 0.8; // Scale to 80% of canvas height
        
        // Draw bar
        ctx.fillRect(
          x, 
          height - barHeight, 
          barWidth - 1, // Leave small gap between bars
          barHeight
        );
      });
      
      // Request next animation frame if recording
      if (isRecording) {
        animationRef.current = requestAnimationFrame(drawVisualizer);
      }
    };
    
    // Start animation
    drawVisualizer();
    
    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioLevel, isRecording]);
  
  // Ensure canvas dimensions match display size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      
      if (canvas.width !== width || canvas.height !== height) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <VisualizerContainer>
      <VisualizerCanvas ref={canvasRef} />
    </VisualizerContainer>
  );
};

export default AudioVisualizer;