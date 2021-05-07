const convertObjectMessageIntoString = message => {
  if (message && typeof message === 'object') return JSON.stringify(message);

  return message;
};

// the return type is always a collection
export default function inferErrorMessages(inputMessage) {
  let msg;

  if (typeof inputMessage === 'string') {
    try {
      msg = JSON.parse(inputMessage);
    } catch (e) {
      // cannot serialize it...lets just return it as a single value
      return [inputMessage];
    }
  } else msg = inputMessage;

  // msg should be an object at this point
  if (!msg?.message && !msg?.errors) { return []; }

  const { message, errors } = msg;
  let finalFormattedMessage;

  if (message) {
    // mostly a csrf message format
    finalFormattedMessage = [message];
  } else if (errors && Array.isArray(errors)) {
    finalFormattedMessage = errors.map(error => error?.message || error);
  } else if (errors) {
    // if errors is not an array could be an object or string for some cases....This should not happen because errors is expected always to be a collection
    finalFormattedMessage = [errors];
  } else finalFormattedMessage = [msg];
  // Unknown error message format response lets just return it completely

  return finalFormattedMessage.map(convertObjectMessageIntoString);
}
