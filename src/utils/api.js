const delay = delay =>
  new Promise(fulfill => {
    setTimeout(fulfill, delay);
  });
const errorMessageTimeOut = {
  message: 'Resource not available ',
  status: 1001,
};

function APIException(response) {
  this.status = response.status;

  if (process.env.NODE_ENV === `development`) {
    this.message = response.message;
  }

  this.message = 'Error';
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

export const api = async (path, opts = {}) => {
  let options;

  // TODO: I could pass the opts for every api call but a lot of extra code
  if (path !== authParams.path)
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
  await delay(2);
  let req;

  // TODO: Since refactoring was a bit tricky
  // Im using this request path determination logic for now
  // I have to get rid of this and pass the request path directly.
  if (path !== '/signin?no_redirect=true') req = `/api${path}`;
  else req = path;

  try {
    const response = await fetch(req, options);

    // TODO: Try to get headers in the response
    // to determine whether a json or text
    console.log('Headers ');
    console.log(`check ${response.headers.get('content-type')}`);
    console.log(`check ${response.headers.get('content-length')}`);

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
        message: { ...body.errors },
      });
    }

    // TODO: in our development we perform
    // a no redirect in our auth sign in requests
    // because it can redirect to our current io application
    // So this may not be necessary for
    if (response.status === 302) {
      const body = await response.json();

      throw new APIException({ status: response.status, message: body });
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

// export const auth = async () => {
//   const options = {
//     credentials: 'same-origin', // this is needed to
// instruct fetch to send cookies
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       email: process.env.API_EMAIL,
//       password: process.env.API_PASSWORD,
//     }),
//     method: 'POST',
//   };
//   const response = await fetch(`/signin?no_redirect=true`, options);
//   // json() returns a promise, so we need to wait for it to complete...
//   const body = await response.json();

//   // console.log('auth fetch response:');
//   // console.log(body);

//   return body.succes;
// };
