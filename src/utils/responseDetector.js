// Response type detector based on user input
export const detectResponseType = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('code') || 
      lowerPrompt.includes('function') || 
      lowerPrompt.includes('program')) {
    return 'code';
  }
  
  if (lowerPrompt.includes('chart') || 
      lowerPrompt.includes('graph') || 
      lowerPrompt.includes('plot') ||
      lowerPrompt.includes('data')) {
    return 'chart';
  }
  
  if (lowerPrompt.includes('list') || 
      lowerPrompt.includes('checklist') || 
      lowerPrompt.includes('todo') ||
      lowerPrompt.includes('items')) {
    return 'list';
  }
  
  return 'text'; // default
};

// Generate mock response based on type
export const generateMockResponse = (type, prompt) => {
  switch(type) {
    case 'code':
      return {
        content: `// Here's your code based on: "${prompt}"\n\nfunction example() {\n  console.log("Hello World");\n  return true;\n}\n\n// You can modify this as needed`,
        language: 'javascript'
      };
      
    case 'chart':
      return {
        data: [
          { name: 'Jan', value: 400 },
          { name: 'Feb', value: 300 },
          { name: 'Mar', value: 600 },
          { name: 'Apr', value: 800 },
          { name: 'May', value: 500 }
        ],
        chartType: 'bar'
      };
      
    case 'list':
      return {
        items: [
          'Complete project setup',
          'Implement response detector',
          'Add typing effect',
          'Test all features',
          'Deploy application'
        ],
        title: 'Your Checklist'
      };
      
    default:
      return {
        content: `Here's my response to: "${prompt}"\n\nThis is a simulated AI response. In a real application, this would be connected to an actual AI model like GPT. The typing effect you just saw simulates streaming response.\n\nFeatures demonstrated:\n• Smart response type detection\n• Word-by-word typing animation\n• Dark/light mode toggle\n• History sidebar\n• Responsive design`
      };
  }
};