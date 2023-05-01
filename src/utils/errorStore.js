import { MOCK_OUTPUT_CANONICAL_FORMAT_LINK, MOCK_RESPONSE_CANONICAL_FORMAT_LINK } from '../constants';

export const MOCK_INPUT_RECORD_ABSENT = 'At least 1 mock input record is required. Mock records must pass through the input filter and hooks to qualify.';

const messages = {
  FILE_SIZE_EXCEEDED: 'File exceeds max file size',
  FILE_TYPE_INVALID: 'Please select valid {{{fileType}}} file',

  // #region mapper error messages
  MAPPER1_DUP_GENERATE: 'Mapper 1.0: Duplicate mappings exist for destination field(s): {{{fields}}}',
  MAPPER1_MISSING_GENERATE: 'Mapper 1.0: One or more destination field values not entered.',
  MAPPER1_MISSING_EXTRACT: 'Mapper 1.0: Source field value not entered for destination field(s): {{{fields}}}',
  MAPPER2_DUP_GENERATE: 'Mapper 2.0: Duplicate destination field(s): {{{fields}}}',
  MAPPER2_MISSING_GENERATE: 'Mapper 2.0: One or more destination field values not entered.',
  MAPPER2_MISSING_EXTRACT: 'Mapper 2.0: Source field value not entered for destination field(s): {{{fields}}}',
  MAPPER2_EXPRESSION_NOT_SUPPORTED: 'Mapper 2.0: You can only use a valid JSONPath expression or hard-coded value for destination field(s): {{{fields}}}',
  MAPPER2_ONLY_JSON_PATH_SUPPORT: 'Mapper 2.0: You can only use a valid JSONPath expression for destination field(s): {{{fields}}}',
  MAPPER2_WRONG_HANDLEBAR_FOR_ROWS: "Mapper 2.0: The source field values should start with 'rows' since input data is of the type rows. For instance rows.field1, rows.field2, etc.",
  MAPPER2_WRONG_HANDLEBAR_FOR_RECORD: "Mapper 2.0: The source field values should start with 'record' since input data is of the type record. For instance record.field1, record.field2, etc.",
  MAPPER2_WRONG_SOURCE_DATA_TYPE: "Mapper 2.0: {{{jsonPath}}}: You can't map {{{sourceDataType}}} (source) to {{{dataType}}} (destination)",
  MAPPER2_MISSING_REQUIRED_FIELDS: 'Mapper 2.0: This import has required destination fields that you must configure with the destination drop-down list.',
  SIGN_UP_CONSENT: 'You must agree to the Terms of Service / Service Subscription Agreement and Privacy Policy to continue.',
  // #endregion

  // #region Mock output error messages
  MOCK_OUTPUT_INVALID_JSON: 'Mock output must be a valid JSON.',
  MOCK_OUTPUT_INVALID_FORMAT: `Mock output must be in integrator.io canonical format. <a href=${MOCK_OUTPUT_CANONICAL_FORMAT_LINK} target="_blank" rel="noreferrer">Learn more.</a>`,
  MOCK_OUTPUT_SIZE_EXCEED: 'Mock output cannot be larger than 1 MB. Decrease your mock data size and try again.',
  MOCK_OUTPUT_NUM_RECORDS_EXCEED: 'Mock output can only contain 10 records. Reduce the number of records and try again.',
  // #endregion

  // #region Mock output error messages
  MOCK_RESPONSE_INVALID_JSON: 'Mock response must be a valid JSON.',
  MOCK_RESPONSE_INVALID_FORMAT: `Mock response must be in integrator.io canonical format. <a href=${MOCK_RESPONSE_CANONICAL_FORMAT_LINK} target="_blank" rel="noreferrer">Learn more.</a>`,
  MOCK_RESPONSE_SIZE_EXCEED: 'Mock response cannot be larger than 1 MB. Decrease your data size and try again.',
  // #endregion

  // #region Filter error
  FILTER_RULES_VALIDATE_NONEMPTY: 'Filters Tree must be a non-empty Array.',
  FILTERSTREE_VALIDATE_OPERATIONNAME: 'Invalid operation: {{{operationName}}}.',
  FILTERSTREE_VALIDATE_FIELDOP_STRINGARG: 'Field operation {{{operationName}}} expects a String argument but received {{{argType}}}.',
  FILTERSTREE_VALIDATE_ARGSIZE: 'Operation {{{operationName}}} expects {{{expectedArgCount}}} argument(s) but received {{{actualArgCount}}}.',
  FILTERSTREE_VALIDATE_ARGSTYPESMATCH: 'Argument #{{{argNumber}}} for operation {{{operationName}}} is a different data type: {{{dataType}}}.',
  FILTERSTREE_VALIDATE_EXPECTEDARGTYPES: 'Argument #{{{argNumber}}} for operation {{{operationName}}} is an incorrect data type. Expected: {{{expectedArgType}}}, received: {{{actualArgType}}}.',
  FILTERSTREE_VALIDATE_FIELDOP_TYPECONV: 'Field operation {{{operationName}}} must be called by a Type Conversion Operation but was called by {{{callingOperation}}}.',
  FILTERSTREE_VALIDATE_FIELDOP_ARGSIZE: 'Field operation {{{operationName}}} expects exactly 1 argument but received {{{argCount}}}.',
  // #endregion
  INVALID_DISPLAY_REF_CUSTOM_SETTINGS: 'The field path set in displayAfter does not exist: {{{invalidFieldPath}}}',
  // #region jsonEditor error messages
  INVALID_JSON_VALUE: '{{{label}}} must be a valid JSON',
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
