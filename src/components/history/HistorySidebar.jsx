import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import HistoryItem from './HistoryItem';
import { useTheme } from '../common/ThemeToggle';

// ===== ANIMATIONS =====
const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const HistorySidebar = ({ history, onHistoryClick, currentPrompt, onClearHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();

  const getTypeIcon = (type) => {
    switch(type) {
      case 'code': return '📝';
      case 'chart': return '📊';
      case 'list': return '✅';
      case 'text': return '💬';
      default: return '🤖';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'code': return '#8b5cf6';
      case 'chart': return '#3b82f6';
      case 'list': return '#10b981';
      case 'text': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a));

  return (
    <>
      {/* Mobile Toggle Button */}
      <MobileToggle 
        onClick={() => setIsOpen(!isOpen)} 
        isOpen={isOpen}
        isDark={isDark}
      >
        <ToggleIcon isOpen={isOpen}>
          <span></span>
          <span></span>
          <span></span>
        </ToggleIcon>
        <ToggleText isDark={isDark}>History</ToggleText>
      </MobileToggle>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && <Overlay onClick={() => setIsOpen(false)} isDark={isDark} />}

      <SidebarContainer 
        isDark={isDark} 
        isOpen={isOpen}
      >
        {/* Header */}
        <SidebarHeader isDark={isDark}>
          <HeaderTop>
            <div>
              <Title isDark={isDark}>
                <HistoryIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </HistoryIcon>
                History
              </Title>
              <PromptCount isDark={isDark}>
                {history.length} {history.length === 1 ? 'prompt' : 'prompts'} saved
              </PromptCount>
            </div>
            
            {history.length > 0 && (
              <ClearButton onClick={onClearHistory} isDark={isDark} title="Clear history">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </ClearButton>
            )}
          </HeaderTop>

          {/* Search Bar */}
          <SearchContainer>
            <SearchInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..."
              isDark={isDark}
            />
            <SearchIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </SearchIcon>
          </SearchContainer>

          {/* Filter Chips */}
          <FilterContainer>
            {['all', 'code', 'chart', 'list', 'text'].map((type) => (
              <FilterChip
                key={type}
                active={filterType === type}
                onClick={() => setFilterType(type)}
                isDark={isDark}
              >
                {type === 'all' ? 'All' : type}
              </FilterChip>
            ))}
          </FilterContainer>
        </SidebarHeader>

        {/* History List */}
        <HistoryList isDark={isDark}>
          {filteredHistory.length > 0 ? (
            <HistoryGroup>
              {sortedDates.map(date => (
                <DateGroup key={date}>
                  <DateHeader isDark={isDark}>
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </DateHeader>
                  <ItemsContainer>
                    {groupedHistory[date].map((item, index) => (
                      <HistoryItem
                        key={`${item.prompt}-${item.timestamp}-${index}`}
                        item={item}
                        isActive={currentPrompt === item.prompt}
                        onClick={() => {
                          onHistoryClick(item);
                          setIsOpen(false); // Close sidebar on mobile after click
                        }}
                        getTypeIcon={getTypeIcon}
                        getTypeColor={getTypeColor}
                        isDark={isDark}
                      />
                    ))}
                  </ItemsContainer>
                </DateGroup>
              ))}
            </HistoryGroup>
          ) : (
            <EmptyState searchTerm={searchTerm} filterType={filterType} isDark={isDark} />
          )}
        </HistoryList>

        {/* Footer Stats */}
        {history.length > 0 && (
          <Footer isDark={isDark}>
            <StatCard isDark={isDark}>
              <StatValue isDark={isDark}>{history.length}</StatValue>
              <StatLabel isDark={isDark}>Total</StatLabel>
            </StatCard>
            <StatCard isDark={isDark}>
              <StatValue isDark={isDark}>
                {new Date(history[0]?.timestamp).toLocaleDateString()}
              </StatValue>
              <StatLabel isDark={isDark}>Latest</StatLabel>
            </StatCard>
          </Footer>
        )}
      </SidebarContainer>
    </>
  );
};

// ===== STYLED COMPONENTS =====
const SidebarContainer = styled.aside`
  width: 22rem;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'};
  border-right: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  box-shadow: ${props => props.isDark
    ? '4px 0 20px -8px rgba(0, 0, 0, 0.5)'
    : '4px 0 20px -8px rgba(0, 0, 0, 0.1)'};
  
  /* Responsive */
  @media (max-width: 1024px) {
    width: 20rem;
  }
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    height: 100vh;
    width: 85%;
    max-width: 320px;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.isDark
      ? '4px 0 30px -5px rgba(0, 0, 0, 0.7)'
      : '4px 0 30px -5px rgba(0, 0, 0, 0.3)'};
    animation: ${props => props.isOpen ? slideIn : 'none'} 0.3s ease;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  background: ${props => props.isDark
    ? 'rgba(31, 41, 55, 0.5)'
    : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)'
    : 'linear-gradient(135deg, #111827 0%, #1f2937 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const HistoryIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
`;

const PromptCount = styled.p`
  font-size: 0.75rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  margin-top: 0.25rem;
`;

const ClearButton = styled.button`
  padding: 0.5rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: #ef4444;
    background-color: ${props => props.isDark ? '#374151' : '#f3f4f6'};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 0.75rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  font-size: 0.875rem;
  background: ${props => props.isDark 
    ? 'rgba(55, 65, 81, 0.8)' 
    : 'rgba(249, 250, 251, 0.8)'};
  border: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 40px;
  outline: none;
  color: ${props => props.isDark ? '#f9fafb' : '#111827'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px ${props => props.isDark 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(59, 130, 246, 0.2)'};
  }
  
  &::placeholder {
    color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1rem 0.625rem 2.25rem;
    font-size: 0.8rem;
  }
`;

const SearchIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  position: absolute;
  left: 0.75rem;
  top: 0.625rem;
  color: ${props => props.isDark ? '#6b7280' : '#9ca3af'};
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterChip = styled.button`
  padding: 0.375rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
  
  background: ${props => {
    if (props.active) {
      return 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
    }
    return props.isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)';
  }};
  
  color: ${props => {
    if (props.active) return 'white';
    return props.isDark ? '#d1d5db' : '#4b5563';
  }};
  
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)'};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.isDark
      ? 'rgba(59, 130, 246, 0.2)'
      : 'rgba(59, 130, 246, 0.15)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.25rem 0.875rem;
    font-size: 0.7rem;
  }
`;

const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: ${props => props.isDark 
    ? 'rgba(31, 41, 55, 0.3)' 
    : 'rgba(255, 255, 255, 0.3)'};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.isDark ? '#1f2937' : '#f3f4f6'};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.isDark ? '#4b5563' : '#9ca3af'};
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const HistoryGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DateGroup = styled.div``;

const DateHeader = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  margin-bottom: 0.75rem;
  position: sticky;
  top: 0;
  background: ${props => props.isDark
    ? 'rgba(31, 41, 55, 0.9)'
    : 'rgba(255, 255, 255, 0.9)'};
  padding: 0.5rem 0;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 5;
  text-transform: uppercase;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  background: ${props => props.isDark
    ? 'rgba(31, 41, 55, 0.5)'
    : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    padding: 0.875rem;
    gap: 0.5rem;
  }
`;

const StatCard = styled.div`
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.5)'
    : 'rgba(249, 250, 251, 0.7)'};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 0.75rem 0.5rem;
  text-align: center;
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)'};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    border-radius: 10px;
  }
`;

const StatValue = styled.span`
  display: block;
  font-weight: 500;
  color: ${props => props.isDark ? 'white' : '#111827'};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
`;

// Mobile Toggle Button
const MobileToggle = styled.button`
  display: none;
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 1001;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'};
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 40px;
  padding: 0.75rem 1.25rem;
  box-shadow: ${props => props.isDark
    ? '0 4px 20px rgba(0, 0, 0, 0.5)'
    : '0 4px 20px rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const ToggleIcon = styled.div`
  width: 20px;
  height: 14px;
  position: relative;
  
  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: ${props => props.isDark ? 'white' : '#111827'};
    border-radius: 2px;
    transition: all 0.3s ease;
    
    &:nth-child(1) {
      top: 0;
      transform: ${props => props.isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
    }
    
    &:nth-child(2) {
      top: 6px;
      opacity: ${props => props.isOpen ? 0 : 1};
    }
    
    &:nth-child(3) {
      top: 12px;
      transform: ${props => props.isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'};
    }
  }
`;

const ToggleText = styled.span`
  color: ${props => props.isDark ? 'white' : '#111827'};
  font-weight: 500;
  font-size: 0.875rem;
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.isDark
    ? 'rgba(0, 0, 0, 0.7)'
    : 'rgba(0, 0, 0, 0.3)'};
  z-index: 999;
  backdrop-filter: blur(2px);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// Empty State Component
const EmptyState = ({ searchTerm, filterType, isDark }) => (
  <EmptyContainer>
    <EmptyIcon isDark={isDark}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    </EmptyIcon>
    {searchTerm ? (
      <>
        <EmptyText isDark={isDark}>No matches found</EmptyText>
        <EmptySubtext isDark={isDark}>Try different keywords</EmptySubtext>
      </>
    ) : filterType !== 'all' ? (
      <>
        <EmptyText isDark={isDark}>No {filterType} history</EmptyText>
        <EmptySubtext isDark={isDark}>Try another filter</EmptySubtext>
      </>
    ) : (
      <>
        <EmptyText isDark={isDark}>No history yet</EmptyText>
        <EmptySubtext isDark={isDark}>Your prompts will appear here</EmptySubtext>
      </>
    )}
  </EmptyContainer>
);

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 10rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
    : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
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

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
`;

const EmptySubtext = styled.p`
  font-size: 0.75rem;
  color: ${props => props.isDark ? '#6b7280' : '#9ca3af'};
  margin-top: 0.25rem;
`;

HistorySidebar.propTypes = {
  history: PropTypes.array.isRequired,
  onHistoryClick: PropTypes.func.isRequired,
  currentPrompt: PropTypes.string,
  onClearHistory: PropTypes.func.isRequired
};

EmptyState.propTypes = {
  searchTerm: PropTypes.string,
  filterType: PropTypes.string,
  isDark: PropTypes.bool
};

export default HistorySidebar;