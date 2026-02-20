import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import { useTheme } from '../common/ThemeToggle';

const Header = ({ onGenerate, isGenerating }) => {
  const { isDark } = useTheme(); 
  
  return (
    <HeaderContainer isDark={isDark}>
      <HeaderContent>
        <LogoSection>
          <LogoIcon isDark={isDark}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </LogoIcon>
          <TextGroup>
            <Title isDark={isDark}>Adaptive AI Response Viewer</Title>
            <Subtitle isDark={isDark}>AI-powered responses with smart detection</Subtitle>
          </TextGroup>
        </LogoSection>

        <ActionSection>
          <StyledButton
            variant="primary"
            size="md"
            onClick={onGenerate}
            disabled={isGenerating}
            isDark={isDark}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </StyledButton>
          <ThemeToggleWrapper isDark={isDark}>
            <ThemeToggle />
          </ThemeToggleWrapper>
        </ActionSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

// ===== STYLED COMPONENTS WITH MODERN AESTHETIC =====
const HeaderContainer = styled.header`
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'};
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  
  /* Subtle shadow - minimal */
  box-shadow: ${props => props.isDark
    ? '0 2px 8px rgba(0, 0, 0, 0.2)'
    : '0 2px 8px rgba(0, 0, 0, 0.04)'};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  /* ===== RESPONSIVE BREAKPOINTS ===== */
  @media (max-width: 1024px) {
    padding: 0.875rem 1.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
    : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'};
  color: white;
  transition: all 0.3s ease;
  
  /* Minimal shadow - barely visible */
  box-shadow: ${props => props.isDark
    ? '0 2px 4px rgba(0, 0, 0, 0.2)'
    : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    
    @media (max-width: 768px) {
      width: 1rem;
      height: 1rem;
    }
  }
  
  /* Responsive sizes */
  @media (max-width: 1024px) {
    width: 2.25rem;
    height: 2.25rem;
  }
  
  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
  }
  
  @media (max-width: 480px) {
    width: 1.75rem;
    height: 1.75rem;
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1024px) {
    display: none;  /* Hide on tablet and mobile */
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.isDark ? '#f9fafb' : '#111827'};
  transition: color 0.3s ease;
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

const Subtitle = styled.p`
  font-size: 0.75rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  transition: color 0.3s ease;
  margin-top: 0.125rem;
  font-weight: 400;
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const StyledButton = styled(Button)`
  min-width: 120px;
  
  /* Responsive button */
  @media (max-width: 1024px) {
    min-width: 100px;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  @media (max-width: 768px) {
    min-width: 44px;  /* Touch target */
    padding: 0.5rem;
    font-size: 0;
    
    /* Show only icon? No, button has text */
    /* But we can show "Gen" instead */
    &::after {
      content: 'Gen';
      font-size: 0.875rem;
    }
    
    span {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    min-width: 40px;
    padding: 0.4rem;
    
    &::after {
      content: 'G';
      font-size: 0.875rem;
    }
  }
`;

// Enhanced ThemeToggle wrapper
const ThemeToggleWrapper = styled.div`
  button {
    background: ${props => props.isDark
      ? 'rgba(55, 65, 81, 0.3)'
      : 'rgba(243, 244, 246, 0.5)'};
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid ${props => props.isDark
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'};
    padding: 0.5rem 1rem;
    border-radius: 40px;
    min-width: 44px;  /* Touch target */
    transition: all 0.2s ease;
    
    /* Minimal shadow */
    box-shadow: ${props => props.isDark
      ? '0 2px 4px rgba(0, 0, 0, 0.2)'
      : '0 2px 4px rgba(0, 0, 0, 0.02)'};
    
    @media (max-width: 1024px) {
      padding: 0.5rem 0.75rem;
    }
    
    @media (max-width: 768px) {
      padding: 0.5rem;
      
      span {
        display: none;  /* Hide text on mobile */
      }
    }
    
    @media (max-width: 480px) {
      padding: 0.4rem;
      min-width: 40px;
    }
    
    &:hover {
      background: ${props => props.isDark
        ? 'rgba(75, 85, 99, 0.5)'
        : 'rgba(229, 231, 235, 0.7)'};
      transform: translateY(-1px);
      
      /* Minimal hover shadow - no extra shadow */
      box-shadow: ${props => props.isDark
        ? '0 2px 6px rgba(0, 0, 0, 0.25)'
        : '0 2px 6px rgba(0, 0, 0, 0.04)'};
    }
    
    &:active {
      transform: translateY(0);
    }
    
    svg {
      width: 1.25rem;
      height: 1.25rem;
      color: ${props => props.isDark ? '#f9fafb' : '#374151'};
      
      @media (max-width: 768px) {
        width: 1rem;
        height: 1rem;
        margin: 0;
      }
    }
    
    span {
      color: ${props => props.isDark ? '#f9fafb' : '#374151'};
      font-size: 0.875rem;
      font-weight: 500;
      margin-left: 0.25rem;
      
      @media (max-width: 1024px) {
        font-size: 0.8rem;
      }
    }
  }
`;

Header.propTypes = {
  onGenerate: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool
};

export default Header;