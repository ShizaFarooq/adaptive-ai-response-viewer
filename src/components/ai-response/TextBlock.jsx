import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '../common/ThemeToggle';

const TextBlock = ({ content = '' }) => {
  const [fontSize, setFontSize] = useState('base');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isDark } = useTheme();

  const formatContent = (text) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <H1 key={index} isDark={isDark}>{line.slice(2)}</H1>;
        }
        if (line.startsWith('## ')) {
          return <H2 key={index} isDark={isDark}>{line.slice(3)}</H2>;
        }
        if (line.startsWith('- ')) {
          return <ListItem key={index} isDark={isDark}>{line.slice(2)}</ListItem>;
        }
        if (line.match(/^\d\./)) {
          return <NumberedItem key={index} isDark={isDark}>{line.slice(3)}</NumberedItem>;
        }
        if (line.startsWith('> ')) {
          return <Blockquote key={index} isDark={isDark}>{line.slice(2)}</Blockquote>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <Paragraph key={index} isDark={isDark}>{line}</Paragraph>;
      });
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const getFontSize = () => {
    switch(fontSize) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Container isDark={isDark}>
      {/* Header with controls */}
      <Header isDark={isDark}>
        <HeaderLeft>
          <HeaderTitle isDark={isDark}>Text Response</HeaderTitle>
          <WordCount isDark={isDark}>
            {wordCount} words · {readingTime} min read
          </WordCount>
        </HeaderLeft>
        
        <HeaderControls>
          {/* Font Size Controls */}
          <FontSizeControl isDark={isDark}>
            <SizeButton
              active={fontSize === 'sm'}
              onClick={() => setFontSize('sm')}
              isDark={isDark}
              size="sm"
            >
              A
            </SizeButton>
            <SizeButton
              active={fontSize === 'base'}
              onClick={() => setFontSize('base')}
              isDark={isDark}
              size="base"
            >
              A
            </SizeButton>
            <SizeButton
              active={fontSize === 'lg'}
              onClick={() => setFontSize('lg')}
              isDark={isDark}
              size="lg"
            >
              A
            </SizeButton>
          </FontSizeControl>

          {/* Text to Speech */}
          <SpeechButton
            onClick={handleTextToSpeech}
            isSpeaking={isSpeaking}
            isDark={isDark}
            title={isSpeaking ? 'Stop speaking' : 'Listen'}
          >
            {isSpeaking ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </SpeechButton>
        </HeaderControls>
      </Header>

      {/* Text Content */}
      <ContentContainer fontSize={getFontSize()} isDark={isDark}>
        {formatContent(content)}
      </ContentContainer>

      {/* Footer with additional tools */}
      <Footer isDark={isDark}>
        <FooterLeft>
          {/* Copy Button */}
          <FooterButton onClick={() => navigator.clipboard.writeText(content)} isDark={isDark}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>Copy</span>
          </FooterButton>

          {/* Download as TXT */}
          <FooterButton
            onClick={() => {
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'ai-response.txt';
              a.click();
            }}
            isDark={isDark}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </FooterButton>
        </FooterLeft>

        {/* Readability Score */}
        <ReadabilityScore isDark={isDark}>
          Readability: {wordCount < 50 ? 'Short' : wordCount < 200 ? 'Medium' : 'Long'}
        </ReadabilityScore>
      </Footer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'};
  border-radius: 24px;
  border: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  overflow: hidden;
  box-shadow: ${props => props.isDark
    ? '0 8px 32px -8px rgba(0, 0, 0, 0.5)'
    : '0 8px 32px -8px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.isDark
      ? '0 12px 40px -10px rgba(0, 0, 0, 0.6)'
      : '0 12px 40px -10px rgba(0, 0, 0, 0.15)'};
  }
  
  @media (max-width: 768px) {
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    border-radius: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.5)'
    : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  @media (max-width: 1024px) {
    padding: 0.75rem 1rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 0.625rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HeaderTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)'
    : 'linear-gradient(135deg, #111827 0%, #1f2937 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const WordCount = styled.span`
  font-size: 0.75rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FontSizeControl = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.isDark
    ? 'rgba(31, 41, 55, 0.5)'
    : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 40px;
  border: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  overflow: hidden;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  
  @media (max-width: 480px) {
    border-radius: 30px;
  }
`;

const SizeButton = styled.button`
  padding: 0.375rem 0.75rem;
  border: none;
  cursor: pointer;
  font-size: ${props => 
    props.size === 'sm' ? '0.75rem' : 
    props.size === 'lg' ? '1rem' : '0.875rem'
  };
  font-weight: 500;
  background: ${props => {
    if (props.active) {
      return props.isDark
        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    }
    return 'transparent';
  }};
  color: ${props => {
    if (props.active) return 'white';
    return props.isDark ? '#9ca3af' : '#4b5563';
  }};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => {
      if (props.active) return;
      return props.isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(243, 244, 246, 0.7)';
    }};
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.25rem 0.625rem;
  }
`;

const SpeechButton = styled.button`
  padding: 0.5rem;
  border-radius: 40px;
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  background: ${props => {
    if (props.isSpeaking) {
      return props.isDark
        ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
        : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
    }
    return props.isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)';
  }};
  color: ${props => {
    if (props.isSpeaking) return props.isDark ? '#f87171' : '#dc2626';
    return props.isDark ? '#9ca3af' : '#4b5563';
  }};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    background: ${props => {
      if (props.isSpeaking) {
        return props.isDark
          ? 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)'
          : 'linear-gradient(135deg, #fecaca 0%, #fee2e2 100%)';
      }
      return props.isDark ? 'rgba(75, 85, 99, 0.7)' : 'rgba(229, 231, 235, 0.7)';
    }};
  }
  
  svg {
    width: 16px;
    height: 16px;
    
    @media (max-width: 768px) {
      width: 14px;
      height: 14px;
    }
  }
`;

const ContentContainer = styled.div`
  padding: 1.75rem;
  font-size: ${props => props.fontSize};
  line-height: 1.7;
  color: ${props => props.isDark ? '#d1d5db' : '#374151'};
  background: ${props => props.isDark
    ? 'rgba(31, 41, 55, 0.3)'
    : 'rgba(255, 255, 255, 0.3)'};
  
  @media (max-width: 1024px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    line-height: 1.6;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

// Text formatting components
const H1 = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)'
    : 'linear-gradient(135deg, #111827 0%, #1f2937 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-top: 1.25rem;
    margin-bottom: 0.875rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const H2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)'
    : 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-top: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

const ListItem = styled.li`
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.isDark ? '#d1d5db' : '#374151'};
  list-style-type: disc;
  line-height: 1.6;
  
  &::marker {
    color: #3b82f6;
  }
`;

const NumberedItem = styled.li`
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.isDark ? '#d1d5db' : '#374151'};
  list-style-type: decimal;
  line-height: 1.6;
  
  &::marker {
    color: #3b82f6;
    font-weight: 600;
  }
`;

const Blockquote = styled.blockquote`
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.3)'
    : 'rgba(243, 244, 246, 0.5)'};
  border-left: 4px solid #3b82f6;
  border-radius: 0 12px 12px 0;
  font-style: italic;
  color: ${props => props.isDark ? '#9ca3af' : '#4b5563'};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

const Paragraph = styled.p`
  margin-bottom: 0.75rem;
  color: ${props => props.isDark ? '#d1d5db' : '#374151'};
  line-height: 1.7;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.5)'
    : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  @media (max-width: 1024px) {
    padding: 0.75rem 1rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 0.625rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FooterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.3)'
    : 'rgba(255, 255, 255, 0.5)'};
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 40px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.isDark ? '#d1d5db' : '#374151'};
    background: ${props => props.isDark
      ? 'rgba(75, 85, 99, 0.5)'
      : 'rgba(243, 244, 246, 0.7)'};
    transform: translateY(-1px);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  @media (max-width: 768px) {
    padding: 0.375rem 0.875rem;
    font-size: 0.7rem;
  }
`;

const ReadabilityScore = styled.div`
  padding: 0.375rem 1rem;
  font-size: 0.6875rem;
  font-weight: 500;
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.3)'
    : 'rgba(255, 255, 255, 0.5)'};
  border-radius: 40px;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)'};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  
  @media (max-width: 768px) {
    padding: 0.25rem 0.875rem;
    font-size: 0.625rem;
  }
`;

TextBlock.propTypes = {
  content: PropTypes.string
};

export default TextBlock;