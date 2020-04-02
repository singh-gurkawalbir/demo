import definitions from './src/forms/definitions';

const checkForHelpText = (fieldMap, resStr) => {
  Object.keys(fieldMap).forEach(key => {
    const { helpText } = fieldMap[key];

    if (helpText) {
      const resType = resStr.endsWith('s')
        ? resStr.substring(0, resStr.length - 1)
        : resStr;
      const str = `"${resType}.${key}" : "${helpText}",`;

      console.log(str);
    }
  });
};

const recurs = (obj, resStr) => {
  if (!obj) return;

  if (obj.fieldMap) {
    return checkForHelpText(obj.fieldMap, resStr);
  }

  Object.keys(obj).forEach(key => {
    recurs(obj[key], resStr || key);
  });
};

const func = () => {
  recurs(definitions, null);
};

export default func;
