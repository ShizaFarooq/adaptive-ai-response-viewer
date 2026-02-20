import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Input from '../common/Input';
import { useTheme } from '../common/ThemeToggle';
import ResponseContainer from '../ai-response/ResponseContainer';

// ===== TYPING EFFECT COMPONENT =====
// ===== TYPING EFFECT COMPONENT =====
const ResponseWithTyping = ({ response, type, onComplete, isDark }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getFullText = () => {
    if (!response) return '';
    
    switch(type) {
      case 'code':
        return response.content || '';
      case 'list':
        return response.items ? response.items.map(item => `• ${item}`).join('\n') : '';
      case 'chart':
        return "📊 Generating chart...\n📈 Loading data...\n🎨 Chart ready!";
      default:
        return response.content || '';
    }
  };

  const fullText = getFullText();
  const words = fullText.split(' ');

  useEffect(() => {
    if (isTyping && currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    } else if (currentIndex >= words.length) {
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  }, [currentIndex, isTyping, words, onComplete]);

  if (!response) return null;

  if (isTyping) {
    return (
      <TypingContainer isDark={isDark}>
        <TypingText isDark={isDark} isCode={type === 'code'}>
          {displayText}
          <Cursor>|</Cursor>
        </TypingText>
      </TypingContainer>
    );
  }

  // ✅ TYPING COMPLETE → RESPONSE CONTAINER RENDER KARO
  return (
    <ResponseContainer
      response={response}
      type={type}
      isGenerating={false}
      isDark={isDark}
    />
  );
};
// ===== CODE BLOCK COMPONENT =====
const CodeBlock = ({ content, isDark }) => (
  <CodeContainer isDark={isDark}>
    <pre>{content}</pre>
  </CodeContainer>
);

const CodeContainer = styled.div`
  background: #0d1117;
  color: #d4d4d4;
  padding: 1.25rem;
  border-radius: 16px;
  overflow-x: auto;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  border: 1px solid ${props => props.isDark ? '#1f2937' : '#e5e7eb'};
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.85rem;
    border-radius: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 0.8rem;
    border-radius: 12px;
  }
`;

// ===== CHART BLOCK COMPONENT =====
const ChartBlock = ({ data, title, isDark }) => (
  <ChartContainer isDark={isDark}>
    <ChartTitle isDark={isDark}>{title}</ChartTitle>
    <ChartBars>
      {data.map((item, i) => (
        <Bar key={i}>
          <BarFill height={item.value / 10} />
          <BarLabel isDark={isDark}>{item.name}: {item.value}</BarLabel>
        </Bar>
      ))}
    </ChartBars>
  </ChartContainer>
);

const ChartContainer = styled.div`
  padding: 1.25rem;
  background: ${props => props.isDark ? '#1f2937' : 'white'};
  border-radius: 16px;
  border: 1px solid ${props => props.isDark ? '#374151' : '#e5e7eb'};
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 14px;
  }
`;

const ChartTitle = styled.h4`
  color: ${props => props.isDark ? 'white' : '#111827'};
  margin-bottom: 15px;
`;

const ChartBars = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const BarFill = styled.div`
  width: 50px;
  height: ${props => props.height}px;
  background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 8px 8px 4px 4px;
  transition: height 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  
  @media (max-width: 480px) {
    width: 40px;
    border-radius: 6px 6px 3px 3px;
  }
`;

const BarLabel = styled.span`
  color: ${props => props.isDark ? '#d1d5db' : '#374151'};
  font-size: 12px;
`;

// ===== LIST BLOCK COMPONENT =====
const ListBlock = ({ items, title, isDark }) => (
  <ListContainer isDark={isDark}>
    <ListTitle isDark={isDark}>{title}</ListTitle>
    <List>
      {items.map((item, i) => (
        <ListItem key={i} isDark={isDark}>
          <input type="checkbox" /> {item}
        </ListItem>
      ))}
    </List>
  </ListContainer>
);

const ListContainer = styled.div`
  padding: 1.25rem;
  background: ${props => props.isDark ? '#1f2937' : 'white'};
  border-radius: 16px;
  border: 1px solid ${props => props.isDark ? '#374151' : '#e5e7eb'};
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 14px;
  }
`;

const ListTitle = styled.h4`
  color: ${props => props.isDark ? 'white' : '#111827'};
  margin-bottom: 15px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin: 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.isDark ? '#d1d5db' : '#161616'};
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
  }
  
  input[type="checkbox"] {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 4px;
    accent-color: #3b82f6;
    
    @media (max-width: 480px) {
      width: 1rem;
      height: 1rem;
    }
  }
`;

// ===== TEXT BLOCK COMPONENT =====
const TextBlock = ({ content, isDark }) => (
  <TextContainer isDark={isDark}>
    {content}
  </TextContainer>
);

const TextContainer = styled.div`
   padding: 1.25rem;
  line-height: 1.7;
  color: ${props => props.isDark ? '#d1d5db' : '#374151'};
  background: ${props => props.isDark ? '#1f2937' : 'white'};
  border-radius: 16px;
  white-space: pre-wrap;
  border: 1px solid ${props => props.isDark ? '#374151' : '#e5e7eb'};
  font-size: 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.95rem;
    border-radius: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }
`;

// ===== TYPING COMPONENTS =====
const TypingContainer = styled.div`
  padding: 1.25rem;
  min-height: 200px;
  border-radius: 16px;
  background: ${props => props.isDark ? '#1f2937' : 'white'};
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 14px;
  }
`;

const TypingText = styled.div`
  font-family: ${props => props.isCode ? 'monospace' : 'inherit'};
  color: ${props => props.isDark ? '#d1d5db' : '#374151'};
  line-height: 1.7;
  white-space: pre-wrap;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.3em;
  background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
  margin-left: 2px;
  animation: blink 1s infinite;
  vertical-align: middle;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

// ===== LOADER COMPONENT =====
const Loader = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  span {
    animation: dots 1.5s infinite;
    opacity: 0;
  }
  span:nth-child(2) { animation-delay: 0.5s; }
  span:nth-child(3) { animation-delay: 1s; }
  @keyframes dots {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

// ===== EMPTY STATE =====
const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.isDark ? '#6b7280' : '#9ca3af'};
  padding: 40px;
  background: ${props => props.isDark ? '#1f2937' : 'white'};
  border-radius: 8px;
`;

// ===== MAIN COMPONENT =====
const MainContent = ({ prompt, onPromptChange, response, responseType, isGenerating, onTypingComplete }) => {
  const { isDark } = useTheme();

  return (
    <Container isDark={isDark}>
      <InputCard isDark={isDark}>
        <InputLabel isDark={isDark}>Ask AI something...</InputLabel>
        <Input
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g., 'give me code'"
          disabled={isGenerating}
          fullWidth
        />
        <Hint isDark={isDark}>Try: code, chart, or list</Hint>
      </InputCard>

      <ResponseCard isDark={isDark}>
        <ResponseHeader>
          <ResponseTitle isDark={isDark}>AI Response</ResponseTitle>
          {responseType && <Badge>{responseType}</Badge>}
        </ResponseHeader>
        
        <ResponseArea>
          {isGenerating && !response ? (
            <Loader isDark={isDark}>
              Generating<span>.</span><span>.</span><span>.</span>
            </Loader>
          ) : response ? (
            <ResponseWithTyping
              response={response}
              type={responseType}
              onComplete={onTypingComplete}
              isDark={isDark}  // ✅ Pass isDark to typing component
            />
          ) : (
            <EmptyState isDark={isDark}>No response yet</EmptyState>
          )}
        </ResponseArea>
      </ResponseCard>
    </Container>
  );
};

// ===== STYLED COMPONENTS =====
const Container = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' 
    : 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'};
  
  /* Responsive */
  @media (max-width: 1024px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const InputCard = styled.div`
  background: ${props => props.isDark 
    ? 'rgba(31, 41, 55, 0.8)' 
    : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  box-shadow: ${props => props.isDark
    ? '0 8px 32px -8px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px -8px rgba(0, 0, 0, 0.1)'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.isDark
      ? '0 12px 40px -10px rgba(0, 0, 0, 0.5)'
      : '0 12px 40px -10px rgba(0, 0, 0, 0.15)'};
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 20px;
    margin-bottom: 1.25rem;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 16px;
    margin-bottom: 1rem;
    
    &:hover {
      transform: none;
    }
  }
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${props => props.isDark ? '#d1d5db' : '#374151'};
`;

const Hint = styled.p`
  font-size: 12px;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  margin-top: 8px;
`;

const ResponseCard = styled.div`
  background: ${props => props.isDark 
    ? 'rgba(31, 41, 55, 0.8)' 
    : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 1.5rem;
  border: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  box-shadow: ${props => props.isDark
    ? '0 8px 32px -8px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px -8px rgba(0, 0, 0, 0.1)'};
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 16px;
  }
`;

const ResponseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const ResponseTitle = styled.h3`
  color: ${props => props.isDark ? 'white' : '#111827'};
  margin: 0;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.375rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 0.25rem 0.875rem;
    font-size: 0.7rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.2rem 0.75rem;
    font-size: 0.65rem;
  }
`;

const ResponseArea = styled.div`
  min-height: 200px;
`;

// PropTypes
MainContent.propTypes = {
  prompt: PropTypes.string.isRequired,
  onPromptChange: PropTypes.func.isRequired,
  response: PropTypes.any,
  responseType: PropTypes.oneOf(['code', 'chart', 'list', 'text']),
  isGenerating: PropTypes.bool,
  onTypingComplete: PropTypes.func
};

ResponseWithTyping.propTypes = {
  response: PropTypes.object,
  type: PropTypes.string,
  onComplete: PropTypes.func,
  isDark: PropTypes.bool
};

CodeBlock.propTypes = {
  content: PropTypes.string,
  isDark: PropTypes.bool
};

ChartBlock.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  isDark: PropTypes.bool
};

ListBlock.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  isDark: PropTypes.bool
};

TextBlock.propTypes = {
  content: PropTypes.string,
  isDark: PropTypes.bool
};

export default MainContent;