export default function inferErrorMessage(inputMessage) {
  let msg;

  try {
    msg = JSON.parse(inputMessage);
  } catch (e) {
    // cannot serialize it...lets just return it as a single value
    return [inputMessage];
  }

  const { message, errors } = msg;

  if (message) {
    // mostly a csrf message format
    return [message];
  } else if (errors) {
    return errors.map(error => error.message);
  }

  // Unknown error message format response lets just return it completely
  return [msg];
}
