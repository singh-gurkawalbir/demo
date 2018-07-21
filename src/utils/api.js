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
  const response = await fetch(`/api${path}`, options);

  return response.json();
};
