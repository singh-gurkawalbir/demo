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
  /**
   * Traverses through dataIn object and masks all values
   *
   * @param {object} dataIn - sample data object.
   * @returns {object with values masked}
   *
   * @example
   *
   * maskValues({a:1, b: {c:2, d:4}})
   * {a:'***', b: {c:'***', d:'***'}}
   */

  maskValues: dataIn => {
    if (!dataIn || typeof dataIn !== 'object') return dataIn;
    function recursiveMask(o, c) {
      const tmp = c;

      Object.keys(o).forEach(propName => {
        const value = o[propName];

        if (value && typeof value === 'object') {
          tmp[propName] = {};
          recursiveMask(value, tmp[propName]);
        } else {
          // this is a terminal node in the encrypted record.
          // lets set the value of the copy to ***
          tmp[propName] = '***';
        }
      });
    }

    const copy = {};

    recursiveMask(dataIn, copy);

    return copy;
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
  getObjectKeyFromValue: (obj = {}, value) =>
    Object.keys(obj)[Object.values(obj).indexOf(value)],
};
