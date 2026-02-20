import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

// ===== ANIMATIONS =====
const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const glow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 4px rgba(59, 130, 246, 0.3);
  }
  50% { 
    text-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
  }
`;

const pulse = keyframes`
  0%, 100% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.02);
  }
`;

const TypingEffect = ({ 
  text = '', 
  speed = 30, 
  onComplete,
  cursor = true,
  cursorChar = '|',
  highlightCode = false
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isGlowing, setIsGlowing] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);

  const words = text.split('');

  const typeNextChar = useCallback(() => {
    if (indexRef.current < words.length) {
      setDisplayText(prev => prev + words[indexRef.current]);
      indexRef.current++;
      timeoutRef.current = setTimeout(typeNextChar, speed);
      
      // Glow effect on typing
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 100);
    } else {
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  }, [words, speed, onComplete]);

  useEffect(() => {
    setDisplayText('');
    setIsTyping(true);
    indexRef.current = 0;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(typeNextChar, 100);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, typeNextChar]);

  return (
    <Container highlightCode={highlightCode} isGlowing={isGlowing}>
      <Content highlightCode={highlightCode}>
        {displayText}
        {isTyping && cursor && <Cursor isGlowing={isGlowing}>{cursorChar}</Cursor>}
      </Content>
      
      {/* Typing progress indicator */}
      {isTyping && words.length > 50 && (
        <ProgressBar>
          <ProgressFill width={(indexRef.current / words.length) * 100} />
        </ProgressBar>
      )}
    </Container>
  );
};

// ===== STYLED COMPONENTS =====
const Container = styled.div`
  font-family: ${props => props.highlightCode ? "'Fira Code', 'JetBrains Mono', monospace" : 'inherit'};
  position: relative;
  width: 100%;
  min-height: 60px;
  padding: 0.5rem;
  border-radius: 12px;
  background: ${props => props.highlightCode 
    ? 'rgba(0, 0, 0, 0.03)' 
    : 'transparent'};
  transition: all 0.3s ease;
  
  /* Glow effect on typing */
  ${props => props.isGlowing && css`
    animation: ${glow} 0.3s ease;
  `}
  
  /* Responsive */
  @media (max-width: 768px) {
    min-height: 50px;
    padding: 0.4rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    min-height: 44px;
    padding: 0.3rem;
    font-size: 0.9rem;
  }
`;

const Content = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.7;
  color: ${props => {
    if (props.highlightCode) return '#10b981';
    return 'inherit';
  }};
  
  /* Code highlighting with gradient */
  ${props => props.highlightCode && css`
    .keyword { color: #f97583; }
    .string { color: #9ecbff; }
    .number { color: #79b8ff; }
    .comment { color: #6a737d; font-style: italic; }
  `}
  
  /* Responsive line height */
  @media (max-width: 768px) {
    line-height: 1.6;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
  margin-left: 2px;
  animation: ${blink} 1s infinite;
  vertical-align: middle;
  border-radius: 1px;
  
  /* Glow on active typing */
  ${props => props.isGlowing && css`
    box-shadow: 0 0 8px #3b82f6;
    animation: ${pulse} 0.2s ease;
  `}
  
  /* Responsive cursor */
  @media (max-width: 768px) {
    width: 1.8px;
    height: 1.1em;
  }
  
  @media (max-width: 480px) {
    width: 1.5px;
    height: 1em;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 2px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 1.5px;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
  
  @media (max-width: 768px) {
    border-radius: 1.5px;
  }
`;

// Preset configurations
export const TypingPresets = {
  slow: { speed: 50, cursor: true },
  medium: { speed: 30, cursor: true },
  fast: { speed: 15, cursor: true },
  instant: { speed: 0, cursor: false },
  code: { speed: 25, highlightCode: true, cursor: true }
};

// Higher-order component for sequences
export const TypingSequence = ({ sequences, loop = false, ...props }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0);

  const handleComplete = () => {
    if (currentIndex < sequences.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setKey(prev => prev + 1);
    } else if (loop) {
      setCurrentIndex(0);
      setKey(prev => prev + 1);
    }
  };

  return (
    <TypingEffect
      key={key}
      text={sequences[currentIndex]}
      onComplete={handleComplete}
      {...props}
    />
  );
};

TypingSequence.propTypes = {
  sequences: PropTypes.arrayOf(PropTypes.string).isRequired,
  loop: PropTypes.bool
};

TypingEffect.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
  onComplete: PropTypes.func,
  cursor: PropTypes.bool,
  cursorChar: PropTypes.string,
  highlightCode: PropTypes.bool
};

export default TypingEffect;