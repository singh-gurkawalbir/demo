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
export const logoutParams = {
  opts: {
    credentials: 'same-origin',
    headers: {
      'Content-Type': ' application/x-www-form-urlencoded',
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

export function getHostAndProtocol() {
  return { protocol: window.location.protocol, host: window.location.host };
}
