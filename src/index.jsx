import { render } from 'react-dom';
import { createStore } from 'redux';
import App from './App';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'exports-loaded':
      return { ...state, exports: action.exports };

    default:
      return state;
  }
};

// this is all demo code, pls ignore (or replace)
const store = createStore(reducer);

// console.log('Redux state = ', store.getState());

store.dispatch({ type: 'exports-loaded', exports: [{ name: 'first' }] });

// console.log('Redux state = ', store.getState());

render(<App />, document.getElementById('root'));
