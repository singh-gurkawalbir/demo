import { isEmpty, cloneDeep, each } from 'lodash';

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
    function maskRecursive(o, c) {
      const tmp = c;

      Object.keys(o).forEach(propName => {
        const value = o[propName];

        if (value && typeof value === 'object') {
          tmp[propName] = {};
          maskRecursive(value, tmp[propName]);
        } else {
          // this is a terminal node in the encrypted record.
          // lets set the value of the copy to ***
          tmp[propName] = '***';
        }
      });
    }

    const copy = {};

    maskRecursive(dataIn, copy);

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
};

/**
 * Works very similar to getJSONPaths, with difference that it checks for the length of any array it encounters.
 * and represents each array object with its index 0, instead of '*' like we do in getJSONPaths, only when array length is 1.
 *
 * @param {array} arr - Usually Array of Objects.
 *
 * @returns {object}
 *
 * @example
 *
 * getUnionObject([{a:'fasd',b:'cas',e:"e"},{f:'g'},{a:'aaa', b:'a'}])
 * {a: 'aaa', b: 'a', e: 'e', f: 'g'}
 */
export function getUnionObject(arr) {
  let toReturn = {};

  if (!arr || !Array.isArray(arr)) {
    return {};
  }

  if (Array.isArray(arr[0])) {
    return arr[0];
  }

  const cloneArr = cloneDeep(arr);

  cloneArr.length = arr.length > 10 ? 10 : arr.length;
  each(cloneArr, obj => {
    if (obj && typeof obj === 'object') {
      toReturn = Object.assign(toReturn, obj);
    }
  });

  return toReturn;
}

/**
    * Traverses through dataIn object and pushes all valid paths to leaf nodes in to array
    *
    * @param {object} dataIn - sample data object.
    * @param {string} prefix
    * @param {boolean} skipSort - boolean value which decides whether to sort the result array
    *
    * @returns {array of objects}
    *
    * @example
    *
    * getJSONPaths({a:'fasd',b:[{c:'d'}], e:[{f:'g'},{f:'g'}]})
    * [
        {id: "a", type:"string"},
        {id: "b[*].c", type:"string"},
        {id:"e[*].f", type: "string"}
      ]
    */
export function getJSONPaths(dataIn, prefix, options = {}) {
  let paths = [];
  let type;

  Object.keys(dataIn).forEach(property => {
    // do stuff
    const v = dataIn[property];
    let k = property;

    if (options.wrapSpecialChars) {
      k = /\W/.test(k)
        ? `[${k.replace(/]/g, options.expression ? '\\\\]' : '\\]')}]`
        : k;
    }

    type = Object.prototype.toString.apply(v);

    if (type === '[object Array]') {
      if (
        Object.prototype.toString.apply(v[0]) === '[object Object]' &&
        !isEmpty(v[0])
      ) {
        paths = paths.concat(
          getJSONPaths(
            getUnionObject(v),
            prefix
              ? [prefix, k + (options.isHandlebarExp ? '.0' : '[*]')].join('.')
              : k + (options.isHandlebarExp ? '.0' : '[*]'),
            options
          )
        );
      } else if (
        options.isHandlebarExp &&
        Object.prototype.toString.apply(v[0]) === '[object Array]' &&
        v[0].length > 0
      ) {
        paths = paths.concat(
          getJSONPaths(
            getUnionObject(v[0]),
            prefix ? [prefix, `${k}.0.0`].join('.') : `${k}.0.0`,
            options
          )
        );
      } else {
        paths.push({
          id: prefix ? [prefix, k].join('.') : k,
          type: 'array',
        });
      }
    } else if (type === '[object Boolean]') {
      paths.push({
        id: prefix ? [prefix, k].join('.') : k,
        type: 'boolean',
      });
    } else if (type === '[object Number]') {
      paths.push({
        id: prefix ? [prefix, k].join('.') : k,
        type: 'number',
      });
    } else if (type === '[object Object]') {
      paths = paths.concat(
        getJSONPaths(v, prefix ? [prefix, k].join('.') : k, options)
      );
    } else if (type === '[object String]') {
      paths.push({
        id: prefix ? [prefix, k].join('.') : k,
        type: 'string',
      });
    } else if (type === '[object Null]') {
      paths.push({
        id: prefix ? [prefix, k].join('.') : k,
        type: 'string',
      });
    }
  });

  if (options.skipSort) {
    return paths;
  }

  return paths.sort((a, b) => {
    if (
      (a.id && a.id.indexOf('[*]') > -1 && b.id && b.id.indexOf('[*]') > -1) ||
      (a.id && a.id.indexOf('[*]') === -1 && b.id && b.id.indexOf('[*]') === -1)
    ) {
      return a.id > b.id ? 1 : -1;
    }

    if (
      a.id &&
      a.id.indexOf('[*]') === -1 &&
      b.id &&
      b.id.indexOf('[*]') > -1
    ) {
      return -1;
    }

    if (
      a.id &&
      a.id.indexOf('[*]') > -1 &&
      b.id &&
      b.id.indexOf('[*]') === -1
    ) {
      return 1;
    }

    return 0;
  });
}
