import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '../common/ThemeToggle';

const ChartBlock = ({ data, chartType = 'bar', title }) => {
  const [chartSize, setChartSize] = useState('medium');
  const [showGrid, setShowGrid] = useState(true);
  const [chartColor, setChartColor] = useState('blue');
  const [localChartType, setLocalChartType] = useState(chartType);
  const { isDark } = useTheme();

  // Color palettes
  const colorPalettes = {
    blue: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
    purple: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
    green: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
    orange: ['#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5']
  };

  // Sample data if none provided
  const defaultData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 }
  ];

  const chartData = data || defaultData;

  const getChartSize = () => {
    switch(chartSize) {
      case 'small': return { height: 200 };
      case 'large': return { height: 500 };
      default: return { height: 350 };
    }
  };

  const renderChart = () => {
    const colors = colorPalettes[chartColor];
    const size = getChartSize();

    const tooltipStyle = {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      border: 'none',
      borderRadius: '0.5rem',
      color: isDark ? '#F9FAFB' : '#111827',
      padding: '0.5rem'
    };

    switch(localChartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={size.height}>
            <LineChart data={chartData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />}
              <XAxis dataKey="name" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: isDark ? '#F9FAFB' : '#111827' }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                strokeWidth={3}
                dot={{ fill: colors[1], strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={size.height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => entry.name}
                outerRadius={size.height * 0.3}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: isDark ? '#F9FAFB' : '#111827' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={size.height}>
            <BarChart data={chartData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />}
              <XAxis dataKey="name" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: isDark ? '#F9FAFB' : '#111827' }} />
              <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Container isDark={isDark}>
      {/* Chart Header */}
      <Header isDark={isDark}>
        <HeaderLeft>
          <Title isDark={isDark}>{title || 'Data Visualization'}</Title>
          <TypeBadge isDark={isDark}>
            {localChartType.charAt(0).toUpperCase() + localChartType.slice(1)} Chart
          </TypeBadge>
        </HeaderLeft>
        
        {/* Chart Controls */}
        <Controls>
          <Select
            value={chartSize}
            onChange={(e) => setChartSize(e.target.value)}
            isDark={isDark}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </Select>

          <Select
            value={localChartType}
            onChange={(e) => setLocalChartType(e.target.value)}
            isDark={isDark}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </Select>

          <Select
            value={chartColor}
            onChange={(e) => setChartColor(e.target.value)}
            isDark={isDark}
          >
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
            <option value="orange">Orange</option>
          </Select>

          <GridButton
            onClick={() => setShowGrid(!showGrid)}
            active={showGrid}
            isDark={isDark}
            title="Toggle Grid"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </GridButton>
        </Controls>
      </Header>

      {/* Chart Content */}
      <ChartContent>
        {renderChart()}
      </ChartContent>

      {/* Chart Footer */}
      <Footer isDark={isDark}>
        <Stats isDark={isDark}>
          <Stat>📊 Total: {chartData.reduce((acc, item) => acc + item.value, 0)}</Stat>
          <Stat>📈 Avg: {(chartData.reduce((acc, item) => acc + item.value, 0) / chartData.length).toFixed(1)}</Stat>
          <Stat>📉 Max: {Math.max(...chartData.map(item => item.value))}</Stat>
        </Stats>
        <DownloadButton isDark={isDark}>
          Download
        </DownloadButton>
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
  
  /* Responsive */
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
  padding: 1rem 1.25rem;
  background: ${props => props.isDark
    ? 'rgba(55, 65, 81, 0.5)'
    : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  @media (max-width: 1024px) {
    padding: 0.875rem 1rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
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

const TypeBadge = styled.span`
  padding: 0.375rem 0.875rem;
  font-size: 0.6875rem;
  font-weight: 600;
  background: ${props => props.isDark
    ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
    : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'};
  color: ${props => props.isDark ? '#93c5fd' : '#1e40af'};
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

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const Select = styled.select`
  font-size: 0.75rem;
  padding: 0.375rem 1rem;
  border-radius: 40px;
  background: ${props => props.isDark
    ? 'rgba(31, 41, 55, 0.7)'
    : 'rgba(255, 255, 255, 0.7)'};
  color: ${props => props.isDark ? '#d1d5db' : '#374151'};
  border: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.05)'};
  outline: none;
  cursor: pointer;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isDark
      ? 'rgba(55, 65, 81, 0.9)'
      : 'rgba(255, 255, 255, 0.9)'};
    transform: translateY(-1px);
  }
  
  &:focus {
    box-shadow: 0 0 0 2px ${props => props.isDark
      ? 'rgba(59, 130, 246, 0.3)'
      : 'rgba(59, 130, 246, 0.2)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.7rem;
  }
`;

const GridButton = styled.button`
  padding: 0.5rem;
  border-radius: 40px;
  border: 1px solid ${props => props.isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  background: ${props => props.active 
    ? (props.isDark 
      ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
      : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)')
    : (props.isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)')};
  color: ${props => props.active
    ? (props.isDark ? '#93c5fd' : '#2563eb')
    : (props.isDark ? '#9ca3af' : '#6b7280')};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active
      ? (props.isDark 
        ? 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)'
        : 'linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%)')
      : (props.isDark ? 'rgba(75, 85, 99, 0.7)' : 'rgba(229, 231, 235, 0.7)')};
    transform: translateY(-1px);
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

const ChartContent = styled.div`
  padding: 1.5rem;
  background: ${props => props.isDark
    ? 'rgba(31, 41, 55, 0.3)'
    : 'rgba(255, 255, 255, 0.3)'};
  
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

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.75rem;
  color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  
  @media (max-width: 1024px) {
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.7rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const Stat = styled.span`
  white-space: nowrap;
`;

const DownloadButton = styled.button`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.375rem 1rem;
  border-radius: 40px;
  background: ${props => props.isDark
    ? 'rgba(59, 130, 246, 0.2)'
    : 'rgba(59, 130, 246, 0.1)'};
  color: ${props => props.isDark ? '#93c5fd' : '#2563eb'};
  border: 1px solid ${props => props.isDark
    ? 'rgba(59, 130, 246, 0.3)'
    : 'rgba(59, 130, 246, 0.2)'};
  cursor: pointer;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isDark
      ? 'rgba(59, 130, 246, 0.3)'
      : 'rgba(59, 130, 246, 0.2)'};
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.25rem 0.875rem;
    font-size: 0.7rem;
  }
`;

ChartBlock.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number
    })
  ),
  chartType: PropTypes.oneOf(['bar', 'line', 'pie']),
  title: PropTypes.string
};

export default ChartBlock;  