const convertObjectMessageIntoString = message => {
  if (message && typeof message === 'object') return JSON.stringify(message);

  return message;
};

export default function inferErrorMessage(inputMessage) {
  let msg;

  try {
    msg = JSON.parse(inputMessage);
  } catch (e) {
    // cannot serialize it...lets just return it as a single value
    return [inputMessage];
  }

  const { message, errors } = msg;
  let finalFormattedMessage;

  if (message) {
    // mostly a csrf message format
    finalFormattedMessage = [message];
  } else if (errors) {
    finalFormattedMessage = errors.map(error => error.message);
  } else finalFormattedMessage = [msg];
  // Unknown error message format response lets just return it completely

  return finalFormattedMessage.map(convertObjectMessageIntoString);
}
