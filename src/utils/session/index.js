const CSRF_TOKEN = '_csrf';

export const setCSRFToken = token => {
  sessionStorage.setItem(CSRF_TOKEN, token);
};

export const getCSRFToken = () => sessionStorage.getItem(CSRF_TOKEN);

export const removeCSRFToken = () => {
  sessionStorage.removeItem(CSRF_TOKEN);
};
