const delay = delay =>
  new Promise(fulfill => {
    setTimeout(fulfill, delay);
  });
const errorMessageTimeOut = {
  message: 'Resource not available ',
  status: 1001,
};

export function APIException(response) {
  this.status = response.status;
  this.message = 'Error';

  if (process.env.NODE_ENV === `development`) {
    this.message = response.message;
  }
}

export const authParams = {
  opts: {
    credentials: 'same-origin', // this is needed to instruct fetch to send cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: process.env.API_EMAIL,
      password: process.env.API_PASSWORD,
    }),
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
      _csrf: 'undefined',
    },
    method: 'POST',
  },
  path: '/signout?no_redirect=true',
};

export const api = async (path, opts = {}) => {
  let options;

  if (path !== authParams.path || path !== logoutParams.path)
    options = {
      ...opts,
      credentials: 'same-origin', // this is needed to instruct fetch to send cookies

      headers: {
        ...(opts.headers || {
          'Content-Type': 'application/json; charset=utf-8',
        }),
      },
    };
  else {
    options = opts;
  }

  // for development only to slow down local api calls
  // lets built for a good UX that can deal with high latency calls...
  await delay(1000);
  let req;

  if (
    path === '/signin?no_redirect=true' ||
    path === '/signout?no_redirect=true'
  ) {
    req = path;
  } else {
    req = `/api${path}`;
  }

  console.log(`api ${JSON.stringify(req)}`);

  try {
    const response = await fetch(req, options);

    if (response.status >= 400 && response.status < 600) {
      let body;

      if (
        response.headers.get('content-type') ===
        'application/json; charset=utf-8'
      )
        body = await response.json();
      else body = await response.text();

      throw new APIException({
        status: response.status,
        message: { ...body },
      });
    }

    // TODO: in our development we perform
    // a no redirect in our auth sign in requests
    // because it can redirect to our current io application
    // So this may not be necessary for
    if (response.status === 302) {
      const body = await response.json();

      throw new APIException({ status: response.status, message: { ...body } });
    }

    // when session is invalidated then we
    // expect to get a 200 response with the response url with the sign in page
    if (response.status === 200) {
      if (
        response.url ===
        `${window.location.protocol}//${window.location.host}/signin`
      )
        throw new APIException({
          status: 401,
          message: 'Session Expired',
        });
    }

    // For 204 content-length header does not show up
    // So using response status to prevent performing .json()
    if (response.status === 204) return null;
    const body = await response.json();

    return body;
  } catch (e) {
    if (e instanceof APIException) throw e;
    else throw new APIException({ ...errorMessageTimeOut });
  }
};
