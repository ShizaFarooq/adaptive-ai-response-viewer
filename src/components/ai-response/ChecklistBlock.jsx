import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '../common/ThemeToggle';

const ChecklistBlock = ({ items = [], title = 'Checklist' }) => {
  const [checklistItems, setChecklistItems] = useState(
    items.map((item, index) => ({
      id: index,
      text: item,
      completed: false,
      priority: 'medium'
    }))
  );
  
  const [filter, setFilter] = useState('all');
  const [newItemText, setNewItemText] = useState('');
  const { isDark } = useTheme();

  const toggleItem = (id) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addItem = () => {
    if (newItemText.trim()) {
      setChecklistItems(prev => [
        ...prev,
        {
          id: Date.now(),
          text: newItemText,
          completed: false,
          priority: 'medium'
        }
      ]);
      setNewItemText('');
    }
  };

  const deleteItem = (id) => {
    setChecklistItems(prev => prev.filter(item => item.id !== id));
  };

  const updatePriority = (id, priority) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, priority } : item
      )
    );
  };

  const filteredItems = checklistItems.filter(item => {
    if (filter === 'completed') return item.completed;
    if (filter === 'pending') return !item.completed;
    return true;
  });

  const progress = checklistItems.length
    ? (checklistItems.filter(i => i.completed).length / checklistItems.length) * 100
    : 0;

  const getPriorityColor = (priority, isDark) => {
    switch(priority) {
      case 'high': return isDark ? '#f87171' : '#dc2626';
      case 'low': return isDark ? '#4ade80' : '#16a34a';
      default: return isDark ? '#facc15' : '#ca8a04';
    }
  };

  return (
    <Container isDark={isDark}>
      {/* Header */}
      <Header isDark={isDark}>
        <HeaderTop>
          <Title isDark={isDark}>{title}</Title>
          <DoneBadge isDark={isDark}>
            {checklistItems.filter(i => i.completed).length}/{checklistItems.length} Done
          </DoneBadge>
        </HeaderTop>
        
        {/* Progress Bar */}
        <ProgressBarContainer isDark={isDark}>
          <ProgressBarFill style={{ width: `${progress}%` }} />
        </ProgressBarContainer>
      </Header>

      {/* Add New Item */}
      <AddItemContainer isDark={isDark}>
        <AddItemInput
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder="Add new item..."
          isDark={isDark}
        />
        <AddButton onClick={addItem}>Add</AddButton>
      </AddItemContainer>

      {/* Filters */}
      <FilterContainer isDark={isDark}>
        {['all', 'pending', 'completed'].map((filterType) => (
          <FilterButton
            key={filterType}
            active={filter === filterType}
            onClick={() => setFilter(filterType)}
            isDark={isDark}
          >
            {filterType}
          </FilterButton>
        ))}
      </FilterContainer>

      {/* Checklist Items */}
      <ItemsContainer>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ItemRow key={item.id} isDark={isDark}>
              <ItemContent>
                <Checkbox
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                />
                
                <ItemText completed={item.completed} isDark={isDark}>
                  {item.text}
                </ItemText>

                {/* Priority Select */}
                <PrioritySelect
                  value={item.priority}
                  onChange={(e) => updatePriority(item.id, e.target.value)}
                  style={{ color: getPriorityColor(item.priority, isDark) }}
                  isDark={isDark}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </PrioritySelect>

                {/* Delete Button */}
                <DeleteButton onClick={() => deleteItem(item.id)} isDark={isDark}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </DeleteButton>
              </ItemContent>
            </ItemRow>
          ))
        ) : (
          <EmptyState isDark={isDark}>
            <p>No items to display</p>
          </EmptyState>
        )}
      </ItemsContainer>

      {/* Footer Stats */}
      <Footer isDark={isDark}>
        <Stat isDark={isDark}>✅ {checklistItems.filter(i => i.completed).length} completed</Stat>
        <Stat isDark={isDark}>⏳ {checklistItems.filter(i => !i.completed).length} pending</Stat>
        <Stat isDark={isDark}>📊 {progress.toFixed(0)}% complete</Stat>
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
  padding: 1rem 1.25rem;
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.5)'
    : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const Title = styled.h3`
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

const DoneBadge = styled.span`
  padding: 0.375rem 0.875rem;
  font-size: 0.6875rem;
  font-weight: 600;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #581c87 0%, #6b21a8 100%)'
    : 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'};
  color: ${props => props.isDark ? '#d8b4fe' : '#6b21a8'};
  border-radius: 40px;
  letter-spacing: 0.3px;
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.05)'};
  
  @media (max-width: 768px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.625rem;
  }
`;

const ProgressBarContainer = styled.div`
  height: 0.5rem;
  background: ${props => props.isDark
    ? 'rgba(75, 85, 99, 0.3)'
    : 'rgba(229, 231, 235, 0.5)'};
  border-radius: 40px;
  overflow: hidden;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  
  @media (max-width: 768px) {
    height: 0.375rem;
  }
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #9333ea;
  transition: width 0.3s ease;
`;

const AddItemContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    flex-direction: column;
  }
`;

const AddItemInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border-radius: 40px;
  border: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.5)'
    : 'rgba(255, 255, 255, 0.7)'};
  color: ${props => props.isDark ? 'white' : '#111827'};
  outline: none;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #9333ea;
    box-shadow: 0 0 0 3px ${props => props.isDark
      ? 'rgba(147, 51, 234, 0.3)'
      : 'rgba(147, 51, 234, 0.2)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(147, 51, 234, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.5rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.isDark ? '#1f2937' : '#f9fafb'};
  border-bottom: 1px solid ${props => props.isDark ? '#374151' : '#e5e7eb'};
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 40px;
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.2s ease;
  
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
    : (props.isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
  color: ${props => props.active
    ? 'white'
    : (props.isDark ? '#9ca3af' : '#4b5563')};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  
  &:hover {
    transform: translateY(-1px);
    background: ${props => props.active
      ? 'linear-gradient(135deg, #7e22ce 0%, #9333ea 100%)'
      : (props.isDark ? 'rgba(75, 85, 99, 0.7)' : 'rgba(243, 244, 246, 0.7)')};
  }
  
  @media (max-width: 768px) {
    padding: 0.375rem 0.875rem;
    font-size: 0.7rem;
  }
`;

const ItemsContainer = styled.div`
  max-height: 24rem;
  overflow-y: auto;
  background-color: ${props => props.isDark ? '#1f2937' : 'white'};
`;

const ItemRow = styled.div`
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isDark
      ? 'rgba(55, 65, 81, 0.3)'
      : 'rgba(249, 250, 251, 0.7)'};
    transform: translateX(4px);
  }
  
  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.875rem;
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid ${props => props.isDark ? '#4b5563' : '#d1d5db'};
  accent-color: #9333ea;
  cursor: pointer;
`;

const ItemText = styled.span`
  flex: 1;
  font-size: 0.875rem;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => {
    if (props.completed) {
      return props.isDark ? '#6b7280' : '#9ca3af';
    }
    return props.isDark ? '#161717' : '#374151';
  }};
`;

const PrioritySelect = styled.select`
  font-size: 0.75rem;
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.5)'
    : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 40px;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  color: ${props => props.color};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.isDark
      ? 'rgba(147, 51, 234, 0.3)'
      : 'rgba(147, 51, 234, 0.2)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
`;

const DeleteButton = styled.button`
  opacity: 0;
  padding: 0.25rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.25rem;
  
  ${ItemRow}:hover & {
    opacity: 1;
  }
  
  &:hover {
    color: #ef4444;
    background-color: ${props => props.isDark ? '#4b5563' : '#f3f4f6'};
  }
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
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
  font-size: 0.75rem;
  
  @media (max-width: 1024px) {
    padding: 0.75rem 1rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    padding: 0.625rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.375rem;
  }
`;

const Stat = styled.span`
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
`;

ChecklistBlock.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string
};

export default ChecklistBlock;