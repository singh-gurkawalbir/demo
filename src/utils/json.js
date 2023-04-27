import isObject from 'lodash/isObject';
import set from 'lodash/set';
import jsonPatch from 'fast-json-patch';
import customCloneDeep from './customCloneDeep';
import { safeParse } from './string';
import errorMessageStore from './errorStore';

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

      if (missingFields.length) {
        errors.push(
          `${missingFields.join(',')} field missing at position ${index}`
        );
      }
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

  // returns an array of keys matched with the given value for obj[key]
  getObjectKeysFromValue: (obj = {}, value) => {
    const keysList = [];

    Object.keys(obj).forEach(key => {
      if (obj[key] === value) {
        keysList.push(key);
      }
    });

    return keysList;
  },
  jsonPathsToObjectNotation: jsonPath => {
    if (!/^\//.test(jsonPath) || typeof jsonPath !== 'string') return jsonPath;

    return jsonPath.split('/').slice(1).join('.');
  },
};

export const setObjectValue = (object, __path, value) => {
  if (!__path || typeof __path !== 'string' || !isObject(object)) return;
  let path = __path;

  if (path.startsWith('/')) {
    path = path.split('/').slice(1).join('.');
  }
  set(object, path, value);
};

export function getChangesPatchSet(updateFn, ...args) {
  if (!args.length) return [];
  try {
    const [object, ...remainingArgs] = args;
    const clonedObject = customCloneDeep(object);
    const observer = jsonPatch.observe(clonedObject);

    updateFn.apply(null, [clonedObject, ...remainingArgs]);

    return jsonPatch.generate(observer);
  } catch (e) {
    return [];
  }
}

export const isJsonValue = (value, label) => {
  // value is parsable
  if (!value || safeParse(value)) return;

  return errorMessageStore('INVALID_JSON_VALUE', {label});
};
