import React, { useState } from 'react';
import './App.css';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

function App() {
  const [isChatMode, setIsChatMode] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessages: Message[] = [
      ...messages,
      { text: inputText, sender: 'user' },
      { text: "高市さんは日本の総理大臣です。", sender: 'bot' }
    ];

    setMessages(newMessages);
    setInputText("");
  };

  return (
    <div style={{ backgroundColor: '#f0f4f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      
      {!isChatMode ? (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
          <p style={{ color: '#888', fontSize: '12px', letterSpacing: '2px', margin: '0 0 10px 0' }}>Politics Study</p>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#333' }}>早苗さんの政策について学ぼう！</h2>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px' }}>任意のお問い合わせに対して早苗さんの考えを返答します。</p>
          <button 
            onClick={() => setIsChatMode(true)}
            style={{ backgroundColor: '#2b6cb0', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '0 4px 10px rgba(43,108,176,0.3)' }}
          >
            チャットを始める
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '90%', maxWidth: '500px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
            <span style={{ color: '#888', fontWeight: 'bold', fontSize: '14px' }}>政策chatbot</span>
            <button 
              onClick={() => setIsChatMode(false)}
              style={{ backgroundColor: '#f0f4f9', color: '#2b6cb0', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              戻る
            </button>
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  backgroundColor: msg.sender === 'user' ? '#2b6cb0' : '#f0f4f9', 
                  color: msg.sender === 'user' ? 'white' : '#333',
                  padding: '12px 18px', 
                  borderRadius: '20px',
                  borderBottomRightRadius: msg.sender === 'user' ? '4px' : '20px',
                  borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '20px',
                  maxWidth: '75%',
                  lineHeight: '1.5',
                  fontSize: '15px'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', backgroundColor: '#fafbfc' }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="例）天気や交通など、気になることを入力"
              style={{ flex: 1, padding: '15px', borderRadius: '30px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{ backgroundColor: '#2b6cb0', color: 'white', border: 'none', padding: '0 25px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              送信
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default App;