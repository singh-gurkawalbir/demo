export const getCSRFParams = {
  opts: {
    credentials: 'same-origin', // this is needed to instruct fetch to send cookies
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  },
  path: '/csrf?contentType=application/json',
};
export const authParams = {
  opts: {
    credentials: 'same-origin', // this is needed to instruct fetch to send cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      email: process.env.API_EMAIL,
      password: process.env.API_PASSWORD,
    },
    method: 'POST',
  },
  path: '/signin?no_redirect=true',
};
export const resetRequestParams = {
  opts: {
    credentials: 'same-origin', // this is needed to instruct fetch to send cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      email: process.env.API_EMAIL,
    },
    method: 'POST',
  },
  path: '/request-reset?no_redirect=true',
};
export const resetPasswordRequestParams = {
  opts: {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      password: process.env.API_PASSWORD,
      token: process.env.API_TOKEN,
    },
    method: 'POST',
  },
  path: '/request-password?no_redirect=true',
};
export const setPasswordRequestParams = {
  opts: {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      password: process.env.API_PASSWORD,
      token: process.env.API_TOKEN,
    },
    method: 'POST',
  },
  path: '/set-initial-password?no_redirect=true',
};
export const setChangeEmailParams = {
  opts: {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      password: process.env.API_PASSWORD,
      token: process.env.API_TOKEN,
    },
    method: 'POST',
  },
  path: '/change-email',
};
export const logoutParams = {
  opts: {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      _csrf: undefined,
    },
    method: 'POST',
  },
  path: '/signout',
};

export const changePasswordParams = {
  opts: {
    method: 'PUT',
  },
  path: '/change-password',
};

export const changeEmailParams = {
  opts: {
    method: 'POST',
  },
  path: '/change-email',
};

export const updateProfileParams = {
  opts: {
    method: 'PUT',
  },
  path: '/profile',
};

export const updatePreferencesParams = {
  opts: {
    method: 'PUT',
  },
  path: '/preferences',
};

export const pingConnectionParams = {
  opts: {
    method: 'POST',
  },
  path: '/connections/ping',
};
export function getHostAndProtocol() {
  return { protocol: window.location.protocol, host: window.location.host };
}
