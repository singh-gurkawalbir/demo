export default async () => {
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
