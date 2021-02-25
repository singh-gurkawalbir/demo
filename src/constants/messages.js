const messages = {
  FILE_SIZE_EXCEEDED: 'File exceeds max file size',
  FILE_TYPE_INVALID: 'Please select valid {{{fileType}}} file',
};

export default function messageStore(key, argsObj) {
  let str = messages[key];

  if (!str) return '';
  if (!argsObj || typeof argsObj !== 'object') return str;

  Object.keys(argsObj).forEach(key => {
    str = str.replace(`{{{${key}}}}`, argsObj[key]);
  });

  return str;
}

