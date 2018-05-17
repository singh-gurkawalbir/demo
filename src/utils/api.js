export default async (path, opts = {}) => {
  const options = {
    ...opts,
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
      ...(opts.headers || {}),
    },
  };
  const response = await fetch(`/api${path}`, options);

  return response.json();
};
