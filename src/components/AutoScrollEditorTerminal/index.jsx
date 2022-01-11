import React, { useCallback, useEffect, useState, useRef } from 'react';
import CodeEditor from '../CodeEditor2';
import isLoggableAttr from '../../utils/isLoggableAttr';

export default function AutoScrollEditorTerminal(props) {
  const aceEditor = useRef(null);
  const {isLoggable} = props;
  const [isMouseInside, setIsMouseInside] = useState(false);
  const [value, setValue] = useState('');
  const handleMouseEnter = useCallback(() => {
    setIsMouseInside(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setIsMouseInside(false);
  }, []);

  const handleAceEditorLoad = useCallback(e => {
    aceEditor.current = e;
  }, []);

  useEffect(() => {
    if (aceEditor?.current?.session && value !== props.value) {
      if (!isMouseInside) {
        setTimeout(() => {
          const row = aceEditor.current?.session?.getLength();

            aceEditor.current?.gotoLine(row, -1, true);
        }, 0);
      }
      setValue(props.value);
    }
  }, [isMouseInside, props.value, value]);

  return (
    <span
      {...isLoggableAttr(isLoggable)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      >
      <CodeEditor
        {...props}
        onLoad={handleAceEditorLoad}
      />
    </span>
  );
}

