const convertObjectMessageIntoString = message => {
  if (message && typeof message === 'object') return JSON.stringify(message);

  return message;
};

function parseInputMessage(message) {
  let parsedMessage;

  if (typeof message === 'string') {
    try {
      parsedMessage = JSON.parse(message);
    } catch (e) {
      // cannot serialize it...lets just return it as a single value
      return [message];
    }
  }

  return parsedMessage || message;
}

export default function inferErrorMessage(inputMessage) {
  const parsedMessage = parseInputMessage(inputMessage);
  const { message, errors } = parsedMessage;
  let finalFormattedMessage;

  if (message) {
    // mostly a csrf message format
    finalFormattedMessage = [message];
  } else if (errors) {
    finalFormattedMessage = errors.map(error => error?.message || error);
  } else finalFormattedMessage = [parsedMessage];
  // Unknown error message format response lets just return it completely

  return finalFormattedMessage.map(convertObjectMessageIntoString);
}

export function getErrorMessage(ipMessage) {
  const parsedMessage = parseInputMessage(ipMessage);

  const { message, errors } = parsedMessage;

  let errorMessage;

  if (message) {
    errorMessage = message;
  } else if (errors) {
    errorMessage = errors[0]?.message;
  } else {
    errorMessage = parsedMessage;
  }

  return errorMessage;
}
