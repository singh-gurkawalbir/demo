const CSRF_TOKEN = '_csrf';

export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('state');

    if (serializedState === null) return undefined;

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);

    sessionStorage.setItem('state', serializedState);
  } catch (err) {
    // have to do something here when deserialization does not go through
  }
};

export const setCSRFToken = token => {
  sessionStorage.setItem(CSRF_TOKEN, token);
};

export const getCSRFToken = () => sessionStorage.getItem(CSRF_TOKEN);

export const removeCSRFToken = () => {
  sessionStorage.removeItem(CSRF_TOKEN);
};
