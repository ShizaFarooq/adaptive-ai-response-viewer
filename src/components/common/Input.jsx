import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

// ===== ANIMATIONS =====
const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

const Input = forwardRef(({ 
  value,
  onChange,
  placeholder = '',
  type = 'text',
  label,
  error,
  disabled = false,
  fullWidth = true,
  className = '',
  isDark,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container fullWidth={fullWidth} className={className}>
      {label && (
        <LabelContainer>
          <Label 
            error={error} 
            isFocused={isFocused}
            isDark={isDark}
          >
            {label}
          </Label>
          {isFocused && <FocusIndicator />}
        </LabelContainer>
      )}
      
      <InputWrapper 
        isFocused={isFocused} 
        error={error}
        disabled={disabled}
        isDark={isDark}
      >
        <StyledInput
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          isDark={isDark}
          {...props}
        />
        
        {!disabled && !error && isFocused && (
          <InputGlow isDark={isDark} />
        )}
      </InputWrapper>
      
      {error && (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorContainer>
      )}
      
      {!error && value && !disabled && (
        <CharCount isDark={isDark}>
          {String(value).length} characters
        </CharCount>
      )}
    </Container>
  );
});

Input.displayName = 'Input';

// ===== STYLED COMPONENTS WITH FULL RESPONSIVENESS =====
const Container = styled.div`
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
  
  /* Responsive container */
  @media (max-width: 480px) {
    width: 100%; /* Force full width on mobile */
  }
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  position: relative;
  
  /* Responsive label container */
  @media (max-width: 768px) {
    margin-bottom: 0.4rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.3rem;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  
  color: ${props => {
    if (props.error) return props.isDark ? '#f87171' : '#ef4444';
    if (props.isFocused) return props.isDark ? '#93c5fd' : '#3b82f6';
    return props.isDark ? '#d1d5db' : '#374151';
  }};
  
  /* Responsive label */
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const FocusIndicator = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  animation: ${float} 2s infinite;
  
  /* Responsive indicator */
  @media (max-width: 480px) {
    width: 3px;
    height: 3px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  border-radius: 16px;
  background: ${props => {
    if (props.disabled) return props.isDark ? '#1f2937' : '#f3f4f6';
    if (props.error) return props.isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)';
    return 'transparent';
  }};
  
  /* Glass morphism effect */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  /* Border with gradient */
  padding: 2px;
  background: ${props => {
    if (props.error) {
      return props.isDark 
        ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
        : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
    }
    if (props.isFocused) {
      return props.isDark
        ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    }
    return props.isDark
      ? 'linear-gradient(135deg, #4b5563 0%, #374151 100%)'
      : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
  }};
  
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.isDark
      ? '0 4px 12px -4px rgba(0, 0, 0, 0.3)'  /* Reduced shadow */
      : '0 4px 12px -4px rgba(0, 0, 0, 0.1)'};
  }
  
  /* Responsive wrapper */
  @media (max-width: 768px) {
    border-radius: 14px;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 12px;
    
    &:hover {
      transform: none; /* Remove hover lift on mobile */
    }
  }
`;

const StyledInput = styled.input`
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  padding: 1rem 1.2rem;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.3s ease;
  
  /* Background with transparency for glass effect */
  background: ${props => {
    if (props.disabled) return props.isDark ? '#1f2937' : '#f3f4f6';
    return props.isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)';
  }};
  
  color: ${props => props.isDark ? '#f9fafb' : '#111827'};
  
  /* Responsive input */
  @media (max-width: 1024px) {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.875rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.75rem;
    font-size: 0.85rem;
    border-radius: 10px;
    min-height: 44px; /* Touch target size */
  }
  
  /* Placeholder styling */
  &::placeholder {
    color: ${props => props.isDark ? '#6b7280' : '#9ca3af'};
    font-weight: 400;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
  
  &:focus::placeholder {
    opacity: 0.5;
  }
  
  /* Remove default focus outline */
  &:focus {
    outline: none;
  }
  
  /* Disabled state */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  /* Autofill styles */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-text-fill-color: ${props => props.isDark ? '#f9fafb' : '#111827'};
    -webkit-box-shadow: 0 0 0px 1000px ${props => props.isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)'} inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const InputGlow = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 18px;
  background: linear-gradient(
    90deg,
    transparent,
    ${props => props.isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'},
    transparent
  );
  animation: ${shimmer} 2s infinite;
  pointer-events: none;
  z-index: -1;
  
  /* Responsive glow */
  @media (max-width: 768px) {
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    display: none; /* Remove glow on mobile for performance */
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(4px);
  animation: ${float} 3s infinite;
  
  /* Responsive error container */
  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    margin-top: 0.4rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.35rem 0.6rem;
    margin-top: 0.3rem;
    border-radius: 8px;
  }
`;

const ErrorIcon = styled.span`
  font-size: 0.875rem;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #ef4444;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const CharCount = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  text-align: right;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  opacity: 0.7;
  
  /* Responsive char count */
  @media (max-width: 768px) {
    margin-top: 0.4rem;
    font-size: 0.7rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 0.3rem;
    font-size: 0.65rem;
  }
`;

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  isDark: PropTypes.bool
};

export default Input;