import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '../common/ThemeToggle';
import CodeBlock from './CodeBlock';
import ChartBlock from './ChartBlock';
import ChecklistBlock from './ChecklistBlock';
import TextBlock from './TextBlock';

const ResponseContainer = ({ 
  response, 
  type, 
  isGenerating,
  error 
}) => {
  const { isDark } = useTheme();

  const renderContent = () => {
    if (error) {
      return <ErrorMessage message={error} isDark={isDark} />;
    }

    if (!response) {
      return <EmptyState isDark={isDark} />;
    }

    switch(type) {
      case 'code':
        return <CodeBlock code={response.content} language={response.language || 'javascript'} />;
      
      case 'chart':
        return <ChartBlock data={response.data} chartType={response.chartType || 'bar'} />;
      
      case 'list':
        return <ChecklistBlock items={response.items} title={response.title} />;
      
      case 'text':
      default:
        return <TextBlock content={response.content} />;
    }
  };

  return (
    <Container>
      {/* Response Content */}
      <ContentArea>
        {isGenerating ? (
          <TypingAnimation isDark={isDark} />
        ) : (
          <TransitionContainer>
            {renderContent()}
          </TransitionContainer>
        )}
      </ContentArea>

      {/* Response Footer */}
      {response && !isGenerating && (
        <Footer isDark={isDark}>
          <FooterItem>Generated just now</FooterItem>
          <FooterDot>•</FooterDot>
          <FooterItem>AI confidence: 98%</FooterItem>
        </Footer>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ContentArea = styled.div`
  position: relative;
`;

const TransitionContainer = styled.div`
  transition: all 0.3s ease-in-out;
`;

const Footer = styled.div`
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

const FooterItem = styled.span``;
const FooterDot = styled.span``;

// Typing Animation Component
const TypingAnimation = ({ isDark }) => (
  <TypingContainer isDark={isDark}>
    <TypingHeader>
      <DotContainer>
        <Dot color="#3b82f6" delay="0ms" />
        <Dot color="#3b82f6" delay="150ms" />
        <Dot color="#3b82f6" delay="300ms" />
      </DotContainer>
      <TypingText isDark={isDark}>AI is generating response...</TypingText>
    </TypingHeader>
    <SkeletonContainer>
      <SkeletonLine isDark={isDark} width="75%" />
      <SkeletonLine isDark={isDark} width="50%" />
      <SkeletonLine isDark={isDark} width="83.333%" />
    </SkeletonContainer>
  </TypingContainer>
);

const TypingContainer = styled.div`
  background: ${props => props.isDark
    ? 'rgba(31, 41, 55, 0.5)'
    : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)'};
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 16px;
  }
`;

const TypingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DotContainer = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Dot = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
    : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'};
  border-radius: 50%;
  animation: bounce 1.2s infinite ease-in-out;
  animation-delay: ${props => props.delay};
  box-shadow: 0 0 10px ${props => props.isDark
    ? 'rgba(59, 130, 246, 0.3)'
    : 'rgba(59, 130, 246, 0.2)'};
  
  @keyframes bounce {
    0%, 100% { 
      transform: translateY(0);
      opacity: 0.6;
    }
    50% { 
      transform: translateY(-8px);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: 0.625rem;
    height: 0.625rem;
  }
`;

const TypingText = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${props => props.isDark ? '#d1d5db' : '#4b5563'};
  letter-spacing: 0.3px;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const SkeletonContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkeletonLine = styled.div`
  height: 1rem;
  width: ${props => props.width};
  background: ${props => props.isDark
    ? 'linear-gradient(90deg, #374151 0%, #4b5563 50%, #374151 100%)'
    : 'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)'};
  background-size: 200% 100%;
  border-radius: 40px;
  animation: shimmer 1.5s infinite;
  
  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
  
  @media (max-width: 768px) {
    height: 0.875rem;
  }
`;

// Empty State Component
const EmptyState = ({ isDark }) => (
  <EmptyContainer isDark={isDark}>
    <EmptyIconContainer isDark={isDark}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </EmptyIconContainer>
    <EmptyTitle isDark={isDark}>No Response Yet</EmptyTitle>
    <EmptyText isDark={isDark}>
      Enter a prompt and click Generate to see AI response
    </EmptyText>
  </EmptyContainer>
);

const EmptyContainer = styled.div`
  background: ${props => props.isDark
    ? 'rgba(31, 41, 55, 0.5)'
    : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)'};
  
  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 2rem 1rem;
    border-radius: 16px;
  }
`;

const EmptyIconContainer = styled.div`
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1.25rem;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
    : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  box-shadow: ${props => props.isDark
    ? '0 8px 20px -4px rgba(0, 0, 0, 0.3)'
    : '0 8px 20px -4px rgba(0, 0, 0, 0.1)'};
  
  svg {
    width: 2.5rem;
    height: 2.5rem;
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    width: 4rem;
    height: 4rem;
    
    svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const EmptyTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${props => props.isDark ? 'white' : '#111827'};
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  max-width: 24rem;
  margin: 0 auto;
`;

// Error Message Component
const ErrorMessage = ({ message, isDark }) => (
  <ErrorContainer isDark={isDark}>
    <ErrorContent>
      <ErrorIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </ErrorIcon>
      <ErrorTextContainer>
        <ErrorTitle isDark={isDark}>Error</ErrorTitle>
        <ErrorMessageText isDark={isDark}>{message}</ErrorMessageText>
      </ErrorTextContainer>
    </ErrorContent>
  </ErrorContainer>
);

const ErrorContainer = styled.div`
  background: ${props => props.isDark
    ? 'rgba(127, 29, 29, 0.5)'
    : 'rgba(254, 226, 226, 0.5)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${props => props.isDark
    ? 'rgba(153, 27, 27, 0.3)'
    : 'rgba(254, 202, 202, 0.5)'};
  border-radius: 20px;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 16px;
  }
`;

const ErrorContent = styled.div`
  display: flex;
  align-items: center;
`;

const ErrorIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  color: #ef4444;
  margin-right: 1rem;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3));
  
  @media (max-width: 768px) {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
  }
`;

const ErrorTextContainer = styled.div``;

const ErrorTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.isDark ? '#fecaca' : '#991b1b'};
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

const ErrorMessageText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.isDark ? '#fca5a5' : '#b91c1c'};
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

// PropTypes
ResponseContainer.propTypes = {
  response: PropTypes.shape({
    content: PropTypes.any,
    language: PropTypes.string,
    data: PropTypes.any,
    chartType: PropTypes.string,
    items: PropTypes.array,
    title: PropTypes.string
  }),
  type: PropTypes.oneOf(['code', 'chart', 'list', 'text']),
  isGenerating: PropTypes.bool,
  error: PropTypes.string
};

TypingAnimation.propTypes = {
  isDark: PropTypes.bool
};

EmptyState.propTypes = {
  isDark: PropTypes.bool
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  isDark: PropTypes.bool
};

export default ResponseContainer;