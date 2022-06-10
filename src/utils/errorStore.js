export const MOCK_INPUT_RECORD_ABSENT = 'At least 1 mock input record is required. Mock records must pass through the input filter and hooks to qualify.';

const messages = {
  FILE_SIZE_EXCEEDED: 'File exceeds max file size',
  FILE_TYPE_INVALID: 'Please select valid {{{fileType}}} file',
  NO_ALIAS_RESOURCE_MESSAGE: 'A value must be provided. Create a {{{label}}} if you don’t have any {{{resourceType}}} configured.',
  NO_ALIASES_MESSAGE: 'You don’t have any aliases.',
  NO_CUSTOM_ALIASES_MESSAGE: 'You don’t have any custom aliases.',
  NO_INHERITED_ALIASES_MESSAGE: 'You don’t have any inherited aliases.',
  DUPLICATE_ALIAS_ERROR_MESSAGE: 'An alias with the same ID already exists. Provide a different ID.',
  ALIAS_VALIDATION_ERROR_MESSAGE: 'Aliases can only contain alphanumeric, hyphen (-), or underscore (_) characters.',
  // #region mapper error messages
  MAPPER1_DUP_GENERATE: 'You have duplicate mappings for the field(s): {{{fields}}}',
  MAPPER1_MISSING_EXTRACT: 'Mapper 1.0: Source record field value not entered for destination record field(s): {{{fields}}}',
  MAPPER2_DUP_GENERATE: 'Mapper 2.0: Duplicate mappings exist for destination record field(s): {{{fields}}}',
  MAPPER2_MISSING_EXTRACT: 'Mapper 2.0: Source record field value not entered for destination record field(s): {{{fields}}}',
  MAPPER_MISSING_GENERATE: 'One or more destination record fields not entered in Mapper 1.0 or 2.0, or blank rows added in Mapper 2.0. Fill in empty fields or delete any empty rows after the first row in Mapper 2.0.',
  // #endregion
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
