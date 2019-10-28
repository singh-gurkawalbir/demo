export default {
  /*

  key can be passed as array of string or array of object containing label and value
  Example: keys = ['generate', 'label']
           keys = [{label: 'generate', value: 'gen'}]
  */
  containsAllKeys: (arr = [], keys = []) => {
    const errors = [];

    arr.forEach((value, index) => {
      const missingFields = [];

      keys.forEach(key => {
        const keyLabel = key.label ? key.label : key;
        const keyValue = key.value ? key.value : key;

        if (!value[keyValue]) {
          missingFields.push(keyLabel);
        }
      });

      if (missingFields.length)
        errors.push(
          `${missingFields.join(',')} field missing at position ${index}`
        );
    });

    return errors.length ? errors.join('\n') : null;
  },
  validateJsonString: s => {
    try {
      JSON.parse(s);

      return null;
    } catch (e) {
      return e.message;
    }
  },
  objectToPatchSet: values =>
    Object.keys(values).map(key => ({
      op: 'replace',
      path: `/${key}`,
      value: values[key],
    })),
  objectForPatchSet: values =>
    Object.keys(values).reduce(
      (result, key) => ({ ...result, [`/${key}`]: values[key] }),
      {}
    ),
};
