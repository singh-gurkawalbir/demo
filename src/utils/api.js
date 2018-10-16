const delay = delay =>
  new Promise(fulfill => {
    setTimeout(fulfill, delay);
  });

export default async (path, opts = {}) => {
  const options = {
    ...opts,
    credentials: 'same-origin', // this is needed to instruct fetch to send cookies

    headers: {
      // now that we session auth, no need for token...
      // Authorization: `Bearer ${process.env.API_TOKEN}`,
      ...(opts.headers || {
        'Content-Type': 'application/json; charset=utf-8',
      }),
    },
  };

  // for development only to slow down local api calls
  // lets built for a good UX that can deal with high latency calls...
  await delay(2);
  const response = await fetch(`/api${path}`, options);

  return response.json();
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
