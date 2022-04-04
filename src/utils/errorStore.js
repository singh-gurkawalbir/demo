export const MOCK_INPUT_RECORD_ABSENT = `You must add atleast one mock input record. 
                If you have provided mock input and expect it to be present at this flow step, 
                verify that it was not excluded from your data earlier in an input filter or hook.`;

const messages = {
  FILE_SIZE_EXCEEDED: 'File exceeds max file size',
  FILE_TYPE_INVALID: 'Please select valid {{{fileType}}} file',
  NO_ALIAS_RESOURCE_MESSAGE: 'A value must be provided. Create a {{{label}}} if you don’t have any {{{resourceType}}} configured.',
  NO_ALIASES_MESSAGE: 'You don’t have any aliases.',
  NO_CUSTOM_ALIASES_MESSAGE: 'You don’t have any custom aliases.',
  NO_INHERITED_ALIASES_MESSAGE: 'You don’t have any inherited aliases.',
  DUPLICATE_ALIAS_ERROR_MESSAGE: 'Use a different alias ID. You already have an alias ID registered with the same name.',
  ALIAS_VALIDATION_ERROR_MESSAGE: 'Your alias ID must contain string type field, alphanumeric, hyphen and underscore characters only.',
};

export default function errorMessageStore(key, argsObj) {
  let str = messages[key];

  if (!str) return '';
  if (!argsObj || typeof argsObj !== 'object') return str;

  Object.keys(argsObj).forEach(key => {
    str = str.replace(`{{{${key}}}}`, argsObj[key]);
  });

  return str;
}
