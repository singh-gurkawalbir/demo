export default function getErrorMessage(response) {
  if (!response || !response.message) {
    return undefined;
  }

  try {
    const message = JSON.parse(response.message);

    return message.errors ? message.errors[0].message : undefined;
  } catch (ex) {
    return response.message;
  }
}
