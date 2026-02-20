import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

// ===== ANIMATIONS =====
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  isDark,
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      isDark={isDark}
      {...props}
    >
      <ButtonContent>
        {children}
      </ButtonContent>
    </StyledButton>
  );
};

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
`;

const StyledButton = styled.button`
  /* ===== BASE STYLES ===== */
  position: relative;
  overflow: hidden;
  border-radius: 40px;  /* Pill shape for modern look */
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  border: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  /* Shimmer effect on hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
    z-index: 1;
  }
  
  &:hover:not(:disabled)::before {
    left: 100%;
  }
  
  /* ===== SIZE STYLES ===== */
  ${props => {
    switch(props.$size) {
      case 'sm':
        return css`
          padding: 0.5rem 1.2rem;
          font-size: 0.875rem;
          
          @media (max-width: 768px) {
            padding: 0.4rem 1rem;
            font-size: 0.8rem;
          }
          
          @media (max-width: 480px) {
            padding: 0.35rem 0.875rem;
            font-size: 0.75rem;
          }
        `;
      case 'lg':
        return css`
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
          
          @media (max-width: 768px) {
            padding: 0.875rem 2rem;
            font-size: 1rem;
          }
          
          @media (max-width: 480px) {
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
          }
        `;
      default: // md
        return css`
          padding: 0.75rem 2rem;
          font-size: 1rem;
          
          @media (max-width: 768px) {
            padding: 0.625rem 1.5rem;
            font-size: 0.875rem;
          }
          
          @media (max-width: 480px) {
            padding: 0.5rem 1.25rem;
            font-size: 0.8rem;
          }
        `;
    }
  }}
  
  /* ===== VARIANT STYLES - LIGHT MODE ===== */
  ${props => {
    switch(props.$variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 4px 12px -4px rgba(59, 130, 246, 0.4);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px -6px rgba(59, 130, 246, 0.6);
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px -3px rgba(59, 130, 246, 0.4);
          }
          
          &:focus-visible {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
          }
        `;
      case 'secondary':
        return css`
          background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
          color: #1f2937;
          box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.1);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.15);
            background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
          }
        `;
      case 'ghost':
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: #4b5563;
          border: 1px solid rgba(0, 0, 0, 0.05);
          
          &:hover:not(:disabled) {
            background: rgba(0, 0, 0, 0.05);
            transform: translateY(-1px);
          }
        `;
      default:
        return '';
    }
  }}
  
  /* ===== DARK MODE STYLES ===== */
  ${props => props.isDark && css`
    ${props.$variant === 'primary' && css`
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      box-shadow: 0 4px 12px -4px rgba(96, 165, 250, 0.3);
      
      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        box-shadow: 0 8px 20px -6px rgba(96, 165, 250, 0.5);
      }
    `}
    
    ${props.$variant === 'secondary' && css`
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
      color: #e5e7eb;
      box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.4);
      
      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
      }
    `}
    
    ${props.$variant === 'ghost' && css`
      background: rgba(255, 255, 255, 0.05);
      color: #d1d5db;
      border: 1px solid rgba(255, 255, 255, 0.1);
      
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
      }
    `}
  `}
  
  /* ===== RESPONSIVE WIDTH ===== */
  ${props => props.$fullWidth && css`
    width: 100%;
    
    @media (max-width: 480px) {
      width: 100%;
    }
  `}
  
  /* ===== TOUCH TARGETS FOR MOBILE ===== */
  @media (max-width: 768px) {
    min-height: 44px;  /* Apple's recommended touch target */
    min-width: 44px;
  }
  
  @media (max-width: 480px) {
    min-height: 40px;
    min-width: 40px;
  }
  
  /* ===== LOADING/PULSE ANIMATION ===== */
  ${props => props.disabled && css`
    animation: ${pulse} 2s ease infinite;
  `}
`;

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  type: PropTypes.string,
  isDark: PropTypes.bool
};

export default Button;