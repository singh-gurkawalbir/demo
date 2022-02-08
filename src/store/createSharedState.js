import { useEffect, useRef, useState } from 'react';

export const createStore = initialState => {
  // state object
  let state;
  // state updaters list
  const listeners = new Set();

  const getState = () => state;
  const setState = nextState => {
    // to support state updater function
    state = typeof nextState === 'function' ? nextState(state) : nextState;
    // Need to call all updaters to keep the global state in sync
    listeners.forEach(listener => listener());
  };

  // using a function that return initalState object
  // This will help us create state updaters close to the state values
  state = typeof initialState === 'function' ? initialState({get: getState, set: setState}) : initialState;

  const subscribe = listener => {
    listeners.add(listener);

    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
};

const defaultState = state => state;
export const useCreatedStore = (store, selector = defaultState, shouldNotReturnTuple) => {
  // To make selector not a dependency in the useEffect, we use ref here
  const selectorRef = useRef(selector);
  // A state slice could be created when a selector function is provided
  // By default the complete global state object will be returned
  // Using selector functions this way will avoid unwanted component re renders when unrelated pieces of state are changed
  const [state, setState] = useState(() => selector(store.getState()));

  useEffect(() => {
    selectorRef.current = selector;
  }, [selector]);

  useEffect(() => {
    const selector = selectorRef.current;
    const setStateCallback = () => {
      setState(() => selector(store.getState()));
    };
    const unsubscribe = store.subscribe(setStateCallback);

    setStateCallback();

    return unsubscribe;
  }, [store]);

  return shouldNotReturnTuple ? state : [state, store.setState];
};

export const createSharedState = initialState => {
  const sharedState = createStore(initialState);
  const shouldNotReturnTuple = typeof initialState === 'function';

  return selector => useCreatedStore(sharedState, selector, shouldNotReturnTuple);
};

