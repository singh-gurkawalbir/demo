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
      ...(opts.headers || {}),
    },
  };

  // for development only to slow down local api calls
  // lets build for a good UX that can deal with high latency calls...
  await delay(200);
  const response = await fetch(`/api${path}`, options);

  return response.json();
};
