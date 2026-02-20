import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/layout/Header';
import HistorySidebar from './components/history/HistorySidebar';
import MainContent from './components/layout/MainContent';
import { ThemeProvider, useTheme } from './components/common/ThemeToggle';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: ${props => props.isDark ? '#111827' : '#f9fafb'};
    color: ${props => props.isDark ? '#f9fafb' : '#111827'};
  }
`;

// SAMPLE DATA - Enhanced with better content
const SAMPLE_DATA = {
  code: {
    content: `// Welcome to Code Block
function calculateAverage(numbers) {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
}

// Example usage
const data = [10, 20, 30, 40, 50];
const result = calculateAverage(data);
console.log(\`Average: \${result}\`); // Output: Average: 30

// Features:
// ✅ Syntax highlighting
// ✅ Copy to clipboard
// ✅ Line numbers
// ✅ Dark mode support`,
    language: 'javascript'
  },
  chart: {
    data: [
      { name: 'Jan', value: 450 },
      { name: 'Feb', value: 380 },
      { name: 'Mar', value: 520 },
      { name: 'Apr', value: 680 },
      { name: 'May', value: 590 }
    ],
    title: 'Monthly Sales Data'
  },
  list: {
    items: [
      'Complete project setup',
      'Implement smart detection',
      'Add typing effect',
      'Fix dark mode',
      'Test all features',
      'Deploy application'
    ],
    title: 'Project Tasks'
  },
  text: {
    content: `# Welcome to Adaptive AI Response Viewer!

Hello! I'm your AI assistant. Here's what I can do:

## Available Commands:
• **Code** - Try: "show me code"
• **Chart** - Try: "create chart" 
• **List** - Try: "make list"

## Features:
✨ Smart detection of response type
✨ Word-by-word typing animation
✨ Dark/Light mode toggle
✨ History sidebar`
  }
};

// DETECTION LOGIC - Enhanced
const detectType = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('code') || lower.includes('function') || lower.includes('program')) return 'code';
  if (lower.includes('chart') || lower.includes('graph') || lower.includes('data')) return 'chart';
  if (lower.includes('list') || lower.includes('todo') || lower.includes('task')) return 'list';
  return 'text';
};

const AppContent = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [responseType, setResponseType] = useState('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);  // ✅ 1. State for sidebar toggle
  const { isDark } = useTheme();

  // GENERATE FUNCTION - FIXED for typing effect
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    const type = detectType(prompt);
    setResponseType(type);
    
    // Clear previous response
    setResponse(null);
    
    setTimeout(() => {
      const mockResponse = SAMPLE_DATA[type];
      setResponse(mockResponse);  // Response set karo, but isGenerating true rahega
      
      const newHistory = {
        id: Date.now(),
        prompt,
        type,
        response: mockResponse,
        timestamp: Date.now()
      };
      setHistory(prev => [newHistory, ...prev].slice(0, 10));
      setCurrentPrompt(prompt);
      
      // ❌ setIsGenerating(false) YAHAN MAT KARO
      // Typing effect complete hone par hoga
      
    }, 1500); // 1.5 sec baad response aayega
  };

  // HISTORY CLICK
  const handleHistoryClick = (item) => {
    setPrompt(item.prompt);
    setResponse(item.response);
    setResponseType(item.type);
    setCurrentPrompt(item.prompt);
    setIsGenerating(false); // History click pe generate button enable
    setSidebarOpen(false); // ✅ Close sidebar on mobile after click
  };

  // TYPING COMPLETE HANDLER
  const handleTypingComplete = () => {
    setIsGenerating(false); // ✅ Typing complete → Button enable
  };

  return (
    <>
      <GlobalStyle isDark={isDark} />
      <AppContainer>
        <Header onGenerate={handleGenerate} isGenerating={isGenerating} />
        <MainLayout>
          <HistorySidebar 
            history={history}
            onHistoryClick={handleHistoryClick}
            currentPrompt={currentPrompt}
            onClearHistory={() => setHistory([])}
            isOpen={sidebarOpen}              // ✅ Pass sidebar state
            onToggle={() => setSidebarOpen(!sidebarOpen)}  // ✅ Pass toggle function
          />
          <MainContent 
            prompt={prompt}
            onPromptChange={setPrompt}
            response={response}
            responseType={responseType}
            isGenerating={isGenerating}
            onTypingComplete={handleTypingComplete}
          />
        </MainLayout>
      </AppContainer>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export default App;