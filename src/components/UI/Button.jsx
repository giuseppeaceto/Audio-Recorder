import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Primary button style */
  background-color: ${props => props.primary ? '#4a90e2' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#4a90e2'};
  border: ${props => props.primary ? 'none' : '1px solid #4a90e2'};
  
  &:hover {
    background-color: ${props => props.primary ? '#2a6fc9' : 'rgba(74, 144, 226, 0.1)'};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    background-color: ${props => props.primary ? '#a0c3e8' : 'transparent'};
    color: ${props => props.primary ? 'white' : '#a0c3e8'};
    border-color: ${props => props.primary ? 'none' : '#a0c3e8'};
    cursor: not-allowed;
  }
  
  /* Icon styling */
  svg {
    margin-right: ${props => props.children ? '8px' : '0'};
  }
`;

const Button = ({ children, icon, primary, ...props }) => {
  return (
    <StyledButton primary={primary} {...props}>
      {icon}
      {children}
    </StyledButton>
  );
};

export default Button;