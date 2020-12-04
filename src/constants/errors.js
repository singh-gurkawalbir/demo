const errors = {
  FILE_SIZE_EXCEEDED: 'File exceeds max file size',
  FILE_TYPE_INVALID: 'Please select valid {{{fileType}}} file',
};

const errorStore = (errorKey, argsObj) => {
  let str = errors[errorKey];

  if (!str) return '';
  if (!argsObj || typeof argsObj !== 'object') return str;

  Object.keys(argsObj).forEach(key => {
    str = str.replace(`{{{${key}}}}`, argsObj[key]);
  });

  return str;
};

export default errorStore;
