import React, { useState, useEffect } from 'react';
import './LoginMemo.css';

const messages = [
  '1. 먼저, 회원이 되세요!',
  '2. 나만의 캘린더를 채워가세요.',
  '3. 혼자는 외롭다면, 친구를 초대하여 일정을 공유하세요.',
  '4. 모든 것은 당신에게 달렸고, 해낼 수 있습니다.'
];

const LoginMemo = ({ speed = 100, delay = 1500, loopDelay = 3000 }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [currentLine, setCurrentLine] = useState('');
    const [charIndex, setCharIndex] = useState(0);
    const [displayedLines, setDisplayedLines] = useState([]);
  
    useEffect(() => {
      if (currentMessageIndex >= messages.length) {
        // 마지막까지 다 출력됨 → loopDelay 뒤에 초기화
        const timer = setTimeout(() => {
          setCurrentMessageIndex(0);
          setDisplayedLines([]);
          setCurrentLine('');
          setCharIndex(0);
        }, loopDelay);
        return () => clearTimeout(timer);
      }
  
      if (charIndex < messages[currentMessageIndex].length) {
        const timer = setTimeout(() => {
          setCurrentLine((prev) => prev + messages[currentMessageIndex].charAt(charIndex));
          setCharIndex(charIndex + 1);
        }, speed);
        return () => clearTimeout(timer);
      } else {
        // 한 문장 타이핑 끝나면 → delay 후 다음 문장
        const timer = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, currentLine]);
          setCurrentLine('');
          setCharIndex(0);
          setCurrentMessageIndex(currentMessageIndex + 1);
        }, delay);
        return () => clearTimeout(timer);
      }
    }, [charIndex, currentMessageIndex, currentLine, delay, speed, loopDelay]);
  
    return (
      <div className="memo-container">
        <div className="memo-paper">
          {displayedLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          {currentLine && <p>{currentLine}</p>}
        </div>
      </div>
    );
};

export default LoginMemo;
