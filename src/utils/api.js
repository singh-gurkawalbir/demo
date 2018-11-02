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
  this.message = response.message;
}

export default async (path, opts = {}) => {
  const options = {
    ...opts,
    credentials: 'same-origin', // this is needed to instruct fetch to send cookies

    headers: {
      ...(opts.headers || {
        'Content-Type': 'application/json; charset=utf-8',
      }),
    },
  };
  // 200 to less than 500 json
  // greater than 500 text

  // for development only to slow down local api calls
  // lets built for a good UX that can deal with high latency calls...
  await delay(2);

  try {
    const response = await fetch(`/api${path}`, options);

    console.log(`check  ${response.status}`);

    if (response.status >= 400 && response.status < 500) {
      const body = await response.json();

      console.log(`threw 400 error${JSON.stringify(...body.errors)}`);
      throw new APIException({
        status: response.status,
        message: { ...body.errors },
      });
    }

    if (response.status >= 500 && response.status < 600) {
      const body = await response.text();

      throw new APIException({ status: response.status, message: body });
    }

    if (response.status === 204) return '';
    const body = await response.json();

    return body;
  } catch (e) {
    if (e instanceof APIException) throw e;
    else throw new APIException({ ...errorMessageTimeOut });
  }
};

export const auth = async () => {
  const options = {
    credentials: 'same-origin', // this is needed to instruct fetch to send cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: process.env.API_EMAIL,
      password: process.env.API_PASSWORD,
    }),
    method: 'POST',
  };
  const response = await fetch(`/signin?no_redirect=true`, options);
  // json() returns a promise, so we need to wait for it to complete...
  const body = await response.json();

  // console.log('auth fetch response:');
  // console.log(body);

  return body.succes;
};
