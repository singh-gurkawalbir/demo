import definitions from './src/forms/definitions';

const checkForHelpText = fieldMap => {
  Object.keys(fieldMap).forEach(key => {
    const { helpText } = fieldMap[key];

    if (helpText) {
      console.log(`${key} : ${helpText}`);
    }
  });
};

const recurs = obj => {
  if (!obj) return;

  if (obj.fieldMap) {
    checkForHelpText(obj.fieldMap);
  }

  Object.keys(obj).forEach(key => {
    recurs(definitions[key]);
  });
};

recurs(definitions);
