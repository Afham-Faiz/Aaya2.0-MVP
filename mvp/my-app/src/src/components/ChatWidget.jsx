import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './ChatWidget.module.css';

const ChatWidget = () => {
  // Core states
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"></meta>

  // Common banking queries
  const toolbarActions = [
    { 
      label: '🏦 Accounts',
      icon: '🏦',
      action: () => handleQuickReply('I need help with my account')
    },
    { 
      label: '💳 Cards',
      icon: '💳',
      action: () => handleQuickReply('I need help with my card')
    },
    { 
      label: '📱 Mobile Banking',
      icon: '📱',
      action: () => handleQuickReply('I need help with mobile banking')
    },
    { 
      label: '👋 Talk to Human',
      icon: '👋',
      action: () => handleQuickReply('I would like to speak with a human agent')
    }
  ];

  const quickReplies = {
    welcome: [
      'Accounts',
      'Cards',
      'Mobile Banking',
      'Human Agent',
    ]
  };
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Message Handlers
  const handleQuickReply = (text) => {
    setInputText(text);
    sendMessage(new Event('submit'), text);
  };

  const sendMessage = async (e, quickReplyText = null) => {
    e.preventDefault();
    const messageText = quickReplyText || inputText;
    if (!messageText.trim()) return;

    setShowWelcome(false);
    setInputText('');
    setIsLoading(true);
    setError(null);

    const timestamp = new Date().toLocaleTimeString();

    setMessages(prev => [...prev, {
      text: messageText,
      sender: 'user',
      timestamp
    }]);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/webhook`, {
        sender: "user",
        message: messageText
      });

      if (response.data.length > 0) {
        const combinedText = response.data.map(msg => msg.text).join('\n\n');
        setMessages(prev => [...prev, {
          text: combinedText,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        }]);
      };
    } catch (error) {
      console.error('Error:', error);
      setError("Sorry, I'm having trouble connecting right now. Please try again.");
    }

    setIsLoading(false);
  };

  const WelcomeMessage = () => (
    <div className={styles.welcomeMessage}>
      <div className={styles.welcomeIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 style={{ marginBottom: '8px', color: '#2d2d2d' }}>Welcome to Bank of Maldives!</h3>
      <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
        I'm Aaya, your virtual banking assistant. How can I help you today?
      </p>
      <div className={styles.quickReplies}>
        {quickReplies.welcome.map((reply, index) => (
          <button
            key={index}
            className={styles.quickReplyButton}
            onClick={() => handleQuickReply(reply)}
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.chatContainer}>
      {/* Toggle Button */}
      <button 
        className={styles.chatToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className={styles.chatWidget}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.avatar}>
              <img 
                src="/aaya-avatar.png" 
                alt="Aaya 2.0"
                width="32"
                height="32"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E31837'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className={styles.headerInfo}>
              <h2 className={styles.headerTitle}>Aaya 2.0</h2>
              <p className={styles.headerSubtitle}>Bank of Maldives Virtual Assistant</p>
            </div>
            <button 
              className={styles.menuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Toolbar */}
          {isMenuOpen && (
            <div className={styles.toolbar}>
              {toolbarActions.map((action, index) => (
                <button
                  key={index}
                  className={styles.toolbarButton}
                  onClick={action.action}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages Area */}
          <div className={styles.messagesContainer}>
            {showWelcome && <WelcomeMessage />}
            
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`${styles.message} ${
                  message.sender === 'user' ? styles.userMessage : styles.botMessage
                }`}
              >
                {message.text}
                <div className={styles.messageTime}>{message.timestamp}</div>
              </div>
            ))}
            
            {isLoading && (
              <div className={styles.typingIndicator}>
                <div className={styles.typingDot} />
                <div className={styles.typingDot} />
                <div className={styles.typingDot} />
              </div>
            )}
            
            {error && (
              <div className={styles.errorMessage}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={styles.inputContainer}>
            <form onSubmit={sendMessage} className={styles.inputForm}>
              <input
                type="text"
                className={styles.input}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={isLoading || !inputText.trim()}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  width="20"
                  height="20"
                  style={{ transform: 'rotate(-45deg)' }}
                >
                  <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;