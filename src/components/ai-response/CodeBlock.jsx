import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../common/ThemeToggle';

const CodeBlock = ({ code, language = 'javascript', showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDark } = useTheme();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const detectLanguage = (code) => {
    if (language !== 'auto') return language;
    
    if (code.includes('def ') || (code.includes('import ') && code.includes(':'))) return 'python';
    if (code.includes('function') || code.includes('const') || code.includes('let')) return 'javascript';
    if (code.includes('<div') || code.includes('<html')) return 'jsx';
    if (code.includes('{') && code.includes('}') && code.includes(';')) return 'css';
    
    return 'javascript';
  };

  const detectedLanguage = detectLanguage(code);
  
  const displayCode = !isExpanded && code.length > 500 
    ? code.substring(0, 500) + '...' 
    : code;

  return (
    <Container>
      {/* Code Block Header */}
      <Header isDark={isDark}>
        <LanguageInfo>
          <Language>{detectedLanguage.toUpperCase()}</Language>
          <CharCount>{(code.length / 1000).toFixed(1)}K chars</CharCount>
        </LanguageInfo>
        
        <Actions>
          {code.length > 500 && (
            <ExpandButton onClick={() => setIsExpanded(!isExpanded)} isDark={isDark}>
              {isExpanded ? 'Show less' : 'Show more'}
            </ExpandButton>
          )}
          
          <CopyButton onClick={handleCopy} isDark={isDark} copied={copied}>
            {copied ? (
              <>
                <CopyIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </CopyIcon>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </CopyIcon>
                <span>Copy</span>
              </>
            )}
          </CopyButton>
        </Actions>
      </Header>

      {/* Code Content */}
      <CodeContainer isExpanded={isExpanded}>
        <SyntaxHighlighter
          language={detectedLanguage}
          style={isDark ? vscDarkPlus : vs}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            background: isDark ? '#1e1e1e' : '#fafafa',
          }}
          lineNumberStyle={{
            color: isDark ? '#4B5563' : '#9CA3AF',
            fontSize: '0.75rem',
            paddingRight: '1rem'
          }}
        >
          {displayCode}
        </SyntaxHighlighter>
      </CodeContainer>

      {/* Language Badges */}
      <Badges isDark={isDark}>
        <Badge label="Syntax Highlighted" color="blue" isDark={isDark} />
        <Badge label="Copy Ready" color="green" isDark={isDark} />
        {detectedLanguage === 'javascript' && <Badge label="ES6+" color="purple" isDark={isDark} />}
        {code.includes('TODO') && <Badge label="Contains TODOs" color="yellow" isDark={isDark} />}
      </Badges>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  box-shadow: ${props => props.isDark
    ? '0 8px 32px -8px rgba(0, 0, 0, 0.5)'
    : '0 8px 32px -8px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${props => props.isDark
      ? '0 12px 40px -10px rgba(0, 0, 0, 0.6)'
      : '0 12px 40px -10px rgba(0, 0, 0, 0.15)'};
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    border-radius: 14px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
    : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'};
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.875rem;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
`;

const LanguageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Language = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%)'
    : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.3px;
  
  /* Responsive */
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CharCount = styled.span`
  font-size: 0.75rem;
  color: ${props => props.isDark ? '#6b7280' : '#9ca3af'};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ExpandButton = styled.button`
  padding: 0.375rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.isDark ? '#d1d5db' : '#4b5563'};
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.5)'
    : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  border-radius: 40px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isDark
      ? 'rgba(75, 85, 99, 0.7)'
      : 'rgba(243, 244, 246, 0.9)'};
    transform: translateY(-1px);
  }
  
  /* Responsive */
  @media (max-width: 480px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.7rem;
  }
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 1rem;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    if (props.copied) {
      return props.isDark
        ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
        : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
    }
    return props.isDark
      ? 'rgba(55, 65, 81, 0.7)'
      : 'white';
  }};
  color: ${props => props.copied ? 'white' : (props.isDark ? '#d1d5db' : '#4b5563')};
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => {
      if (props.copied) return;
      return props.isDark
        ? 'rgba(75, 85, 99, 0.9)'
        : '#f9fafb';
    }};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.isDark
      ? 'rgba(16, 185, 129, 0.2)'
      : 'rgba(16, 185, 129, 0.15)'};
  }
  
  /* Responsive */
  @media (max-width: 480px) {
    padding: 0.25rem 0.75rem;
    gap: 0.25rem;
    
    span {
      font-size: 0.7rem;
    }
  }
`;

const CopyIcon = styled.svg`
  width: 0.875rem;
  height: 0.875rem;
`;

const CodeContainer = styled.div`
  max-height: ${props => props.isExpanded ? 'none' : '400px'};
  overflow: auto;
  background-color: ${props => props.isDark ? '#0d1117' : '#fafafa'};
  position: relative;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.isDark ? '#1f2937' : '#f3f4f6'};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.isDark ? '#4b5563' : '#9ca3af'};
    border-radius: 4px;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    max-height: ${props => props.isExpanded ? 'none' : '350px'};
  }
  
  @media (max-width: 480px) {
    max-height: ${props => props.isExpanded ? 'none' : '300px'};
    
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
  }
`;

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
    : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'};
  border-top: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.875rem;
    gap: 0.375rem;
  }
`;

const Badge = ({ label, color, isDark }) => {
  const getBadgeColors = () => {
    switch(color) {
      case 'blue':
        return isDark 
          ? { bg: '#1e3a8a', text: '#93c5fd' }
          : { bg: '#dbeafe', text: '#1e40af' };
      case 'green':
        return isDark
          ? { bg: '#064e3b', text: '#6ee7b7' }
          : { bg: '#d1fae5', text: '#065f46' };
      case 'purple':
        return isDark
          ? { bg: '#4c1d95', text: '#c4b5fd' }
          : { bg: '#ede9fe', text: '#5b21b6' };
      case 'yellow':
        return isDark
          ? { bg: '#78350f', text: '#fde047' }
          : { bg: '#fef3c7', text: '#92400e' };
      default:
        return isDark
          ? { bg: '#374151', text: '#d1d5db' }
          : { bg: '#f3f4f6', text: '#1f2937' };
    }
  };

  const colors = getBadgeColors();

  return (
    <BadgeContainer bg={colors.bg} text={colors.text}>
      {label}
    </BadgeContainer>
  );
};

const BadgeContainer = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 40px;
  font-size: 0.6875rem;
  font-weight: 600;
  background-color: ${props => props.bg};
  color: ${props => props.text};
  letter-spacing: 0.3px;
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)'};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 0.2rem 0.625rem;
    font-size: 0.65rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.15rem 0.5rem;
    font-size: 0.6rem;
  }
`;

// PropTypes
CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
  showLineNumbers: PropTypes.bool
};

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'yellow', 'gray']),
  isDark: PropTypes.bool
};

export default CodeBlock;