import { useEffect, useCallback, useReducer } from 'react';

const blacklistedTargets = ['INPUT', 'TEXTAREA'];
const keysReducer = (state, action) => {
  switch (action.type) {
    case 'set-key-down':
      return { ...state, [action.key]: true };
    case 'set-key-up':
      return { ...state, [action.key]: false };
    default:
      return state;
  }
};

const useKeyboardShortcut = (shortcutKeys, callback, {ignoreBlacklist = false, useCapture = true} = {}) => {
  if (!Array.isArray(shortcutKeys)) {
    throw new Error(
      'The first parameter to `useKeyboardShortcut` must be an ordered array of `KeyboardEvent.key` strings.'
    );
  }

  if (!shortcutKeys.length) {
    throw new Error(
      'The first parameter to `useKeyboardShortcut` must contain at least one `KeyboardEvent.key` string.'
    );
  }

  if (!callback || typeof callback !== 'function') {
    throw new Error(
      'The second parameter to `useKeyboardShortcut` must be a function that will be invoked when the keys are pressed.'
    );
  }

  const initialKeyMapping = shortcutKeys.reduce((currentKeys, key) => {
    // eslint-disable-next-line no-param-reassign
    currentKeys[key.toLowerCase()] = false;

    return currentKeys;
  }, {});
  const [keys, setKeys] = useReducer(keysReducer, initialKeyMapping);
  const keydownListener = useCallback(
    keydownEvent => {
      const { key = '', target, repeat } = keydownEvent;
      const loweredKey = key.toLowerCase();

      if (repeat) return;

      if (!ignoreBlacklist && blacklistedTargets.includes(target.tagName)) return;

      if (keys[loweredKey] === undefined) return;

      if (keys[loweredKey] === false) setKeys({ type: 'set-key-down', key: loweredKey });
    },
    [ignoreBlacklist, keys]
  );
  const keyupListener = useCallback(
    keyupEvent => {
      const { key = '', target } = keyupEvent;
      const loweredKey = key.toLowerCase();

      if (!ignoreBlacklist && blacklistedTargets.includes(target.tagName)) return;

      if (keys[loweredKey] === undefined) return;

      if (keys[loweredKey] === true) setKeys({ type: 'set-key-up', key: loweredKey });
    },
    [ignoreBlacklist, keys]
  );

  // Make sure that when you use this hook you properly cache your callback.
  // If you don't, this useEffect will get called repeatedly!
  useEffect(() => {
    if (!Object.values(keys).filter(value => !value).length) callback(keys);
  }, [callback, keys]);

  useEffect(() => {
    window.addEventListener('keydown', keydownListener, useCapture);

    return () => window.removeEventListener('keydown', keydownListener, useCapture);
  }, [keydownListener, useCapture]);

  useEffect(() => {
    window.addEventListener('keyup', keyupListener, useCapture);

    return () => window.removeEventListener('keyup', keyupListener, useCapture);
  }, [keyupListener]);
};

export default useKeyboardShortcut;
