import { Typography } from '@material-ui/core';
import React, {useEffect, useState, useRef} from 'react';

export default function ChatInput({
  isChatPending,
  onNewPrompt,
  placeholder,
}) {
  const [history, setHistory] = useState([]);
  const [prompt, setPrompt] = useState('');
  const promptRef = useRef(null);

  const handleChange = e => {
    setPrompt(e.target.value);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // handle the enter/return key press, but not if SHIFT is pressed.
      e.preventDefault();
      setHistory([...history, prompt]);
      onNewPrompt(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = e => {
    // if the user presses the up arrow, and there is a previous prompt in the history,
    // and the current prompt is empty, then replace the current prompt with the previous prompt.
    if (e.key === 'ArrowUp' && history.length && !prompt) {
      const previousPrompt = history[history.length - 1];

      setPrompt(previousPrompt);

      setTimeout(() => {
      promptRef.current?.setSelectionRange(previousPrompt.length, previousPrompt.length);
      }, 15);
    }
  };

  useEffect(() => {
    const $prompt = promptRef.current;

    if ($prompt) {
      $prompt.scrollIntoView();
      promptRef.current?.focus();
    }
  }, [isChatPending]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflowY: 'auto',
      }}
    >
      {history.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Typography style={{ color: '#C0C0C0', marginBottom: 12 }} key={index}>
          {item}
        </Typography>
      ))}

      <Typography component="div">
        <textarea
          disabled={isChatPending}
          ref={promptRef}
          value={prompt}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          style={{
            paddingBottom: 16,
            minHeight: 90,
            width: '100%',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            resize: 'none',
            border: 'none',
            borderTop: history.length ? 'solid 1px lightGrey' : 'none',
            outline: 'none',
            backgroundColor: 'transparent',
          }}
          placeholder={isChatPending ? '' : placeholder}
          />
      </Typography>

    </div>
  );
}
