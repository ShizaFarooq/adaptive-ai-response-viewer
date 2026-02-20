import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

// ===== ANIMATIONS =====
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const HistoryItem = ({ item, isActive, onClick, getTypeIcon, getTypeColor, isDark }) => {
  return (
    <ItemContainer 
      onClick={onClick} 
      isActive={isActive} 
      isDark={isDark}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <IconContainer color={getTypeColor(item.type)} isDark={isDark} isActive={isActive}>
        {getTypeIcon(item.type)}
      </IconContainer>
      <ContentContainer>
        <PromptText isActive={isActive} isDark={isDark}>
          {item.prompt}
        </PromptText>
        <TimeText isDark={isDark}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </TimeText>
      </ContentContainer>
      {isActive && <ActiveIndicator />}
    </ItemContainer>
  );
};

// ===== STYLED COMPONENTS =====
const ItemContainer = styled.button`
  width: 100%;
  text-align: left;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.3s ease;
  
  /* Border color */
  border-color: ${props => {
    if (props.isActive) {
      return props.isDark 
        ? 'rgba(96, 165, 250, 0.5)' 
        : 'rgba(59, 130, 246, 0.3)';
    }
    return 'transparent';
  }};
  
  /* Background with glass morphism */
  background: ${props => {
    if (props.isActive) {
      return props.isDark
        ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.9) 100%)';
    }
    return props.isDark
      ? 'rgba(31, 41, 55, 0.5)'
      : 'rgba(255, 255, 255, 0.7)';
  }};
  
  /* Glass effect */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  /* Box shadow */
  box-shadow: ${props => props.isActive
    ? props.isDark
      ? '0 8px 20px -4px rgba(96, 165, 250, 0.3)'
      : '0 8px 20px -4px rgba(59, 130, 246, 0.2)'
    : props.isDark
      ? '0 2px 8px rgba(0, 0, 0, 0.2)'
      : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  
  /* Hover effect */
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.isActive
      ? props.isDark
        ? '0 12px 28px -6px rgba(96, 165, 250, 0.4)'
        : '0 12px 28px -6px rgba(59, 130, 246, 0.3)'
      : props.isDark
        ? '0 8px 20px -4px rgba(0, 0, 0, 0.3)'
        : '0 8px 20px -4px rgba(0, 0, 0, 0.1)'};
  }
  
  /* Focus state for accessibility */
  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 0.875rem;
    gap: 0.875rem;
    border-radius: 14px;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.75rem;
    border-radius: 12px;
    min-height: 64px; /* Touch target */
  }
`;

const IconContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: ${props => `${props.color}15`};
  color: ${props => props.color};
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  
  /* Gradient overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isActive
      ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
      : 'none'};
    border-radius: inherit;
  }
  
  /* Icon shadow */
  box-shadow: 0 2px 8px ${props => `${props.color}30`};
  
  /* Responsive */
  @media (max-width: 768px) {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.125rem;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
    border-radius: 8px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0; /* For text truncation */
`;

const PromptText = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
  
  /* Text color */
  color: ${props => {
    if (props.isActive) {
      return props.isDark ? '#f0f9ff' : '#1e3a8a';
    }
    return props.isDark ? '#e5e7eb' : '#1f2937';
  }};
  
  /* Truncation */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Text shadow for depth */
  text-shadow: ${props => props.isActive
    ? '0 1px 2px rgba(0, 0, 0, 0.1)'
    : 'none'};
  
  /* Responsive */
  @media (max-width: 768px) {
    font-size: 0.875rem;
    margin-bottom: 0.125rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const TimeText = styled.p`
  font-size: 0.75rem;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.3px;
  
  /* Text color */
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  
  /* Responsive */
  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`;

const ActiveIndicator = styled.span`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 3px 0 0 3px;
  animation: ${pulse} 2s infinite;
  
  /* Responsive */
  @media (max-width: 768px) {
    width: 2px;
  }
`;

HistoryItem.propTypes = {
  item: PropTypes.shape({
    prompt: PropTypes.string.isRequired,
    type: PropTypes.string,
    timestamp: PropTypes.number.isRequired
  }).isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  getTypeIcon: PropTypes.func.isRequired,
  getTypeColor: PropTypes.func.isRequired,
  isDark: PropTypes.bool
};

export default HistoryItem;