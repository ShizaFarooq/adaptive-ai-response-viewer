import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import Button from './Button';

// ===== ANIMATIONS =====
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

// Create context for theme
const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = React.useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <StyledButton
      variant="ghost"
      size="md"
      onClick={toggleTheme}
      isDark={isDark}
      className={className}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <ToggleContent>
        {isDark ? (
          <>
            <SunIconWrapper>
              <SunIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </SunIcon>
            </SunIconWrapper>
            <ToggleText isDark={isDark}>Light Mode</ToggleText>
          </>
        ) : (
          <>
            <MoonIconWrapper>
              <MoonIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </MoonIcon>
            </MoonIconWrapper>
            <ToggleText isDark={isDark}>Dark Mode</ToggleText>
          </>
        )}
      </ToggleContent>
    </StyledButton>
  );
};

// ===== STYLED COMPONENTS WITH FULL RESPONSIVENESS =====
const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 40px;
  padding: 0.5rem 1rem;
  min-width: 44px; /* Touch target */
  transition: all 0.2s ease;
  
  /* Responsive button */
  @media (max-width: 1024px) {
    padding: 0.5rem 0.875rem;
    gap: 0.4rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    gap: 0.3rem;
    
    span {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem 0.6rem;
    min-width: 40px;
    
    span {
      display: none; /* Hide text on very small screens */
    }
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.isDark 
      ? '0 4px 12px -4px rgba(96, 165, 250, 0.3)' 
      : '0 4px 12px -4px rgba(59, 130, 246, 0.25)'};
    
    @media (max-width: 768px) {
      transform: translateY(-1px);
    }
    
    @media (max-width: 480px) {
      transform: none; /* Remove hover lift on mobile */
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ToggleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.3rem;
  }
`;

const IconWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Responsive icon wrapper */
  @media (max-width: 1024px) {
    width: 22px;
    height: 22px;
  }
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
  }
`;

const SunIconWrapper = styled(IconWrapper)`
  animation: ${rotate} 20s linear infinite;
  
  @media (max-width: 768px) {
    animation: ${rotate} 15s linear infinite; /* Faster on mobile */
  }
  
  @media (max-width: 480px) {
    animation: ${rotate} 10s linear infinite;
  }
  
  &:hover {
    animation: ${rotate} 5s linear infinite;
  }
`;

const MoonIconWrapper = styled(IconWrapper)`
  animation: ${float} 3s ease infinite;
  
  @media (max-width: 768px) {
    animation: ${float} 2.5s ease infinite;
  }
`;

const IconBase = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  position: relative;
  z-index: 2;
  
  /* Responsive icon */
  @media (max-width: 1024px) {
    width: 1.125rem;
    height: 1.125rem;
  }
  
  @media (max-width: 768px) {
    width: 1rem;
    height: 1rem;
  }
  
  @media (max-width: 480px) {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const SunIcon = styled(IconBase)`
  color: ${props => props.isDark ? '#fbbf24' : '#f59e0b'};
  
  /* Add subtle glow on hover */
  ${SunIconWrapper}:hover & {
    filter: drop-shadow(0 0 4px ${props => props.isDark ? '#fbbf24' : '#f59e0b'});
  }
`;

const MoonIcon = styled(IconBase)`
  color: ${props => props.isDark ? '#a78bfa' : '#8b5cf6'};
  
  /* Add subtle glow on hover */
  ${MoonIconWrapper}:hover & {
    filter: drop-shadow(0 0 4px ${props => props.isDark ? '#a78bfa' : '#8b5cf6'});
  }
`;

const ToggleText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.isDark ? '#f9fafb' : '#111827'};
  transition: color 0.2s ease;
  
  /* Responsive text */
  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    display: none; /* Hide text on very small screens */
  }
`;

ThemeToggle.propTypes = {
  className: PropTypes.string
};

export default ThemeToggle;