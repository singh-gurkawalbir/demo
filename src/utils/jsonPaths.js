import * as _ from 'lodash';
import { celigoListCompare } from './sort';

const emptySet = [];
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

  const cloneArr = _.cloneDeep(arr);

  cloneArr.length = arr.length > 10 ? 10 : arr.length;
  _.each(cloneArr, obj => {
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
export default function getJSONPaths(dataIn, prefix, options = {}) {
  // in some scenarios export data will be of type string, so adding extra check
  // for eg,fetch all blocked phone numbers(assistant: message media) operation
  // returns just array of phone numbers
  if (!dataIn || typeof dataIn !== 'object') return emptySet;

  let paths = [];
  let type;

  Object.keys(dataIn).forEach(property => {
    if (property in dataIn) {
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
        if (!options.excludeArrayIndices && Object.prototype.toString.apply(v[0]) === '[object Object]' && !_.isEmpty(v[0])) {
          paths = paths.concat(
            getJSONPaths(
              getUnionObject(v),
              prefix
                ? [prefix, k + (options.isHandlebarExp ? '.0' : '[*]')].join(
                  '.'
                )
                : k + (options.isHandlebarExp ? '.0' : '[*]'),
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
    }
  });

  if (options.skipSort) {
    return paths;
  }

  return paths.sort(celigoListCompare);
}

/**
 * Works very similar to getJSONPaths, with difference that it checks for the length of any array it encounters.
 * and represents each array object with its index 0, instead of '*' like we do in getJSONPaths, only when array length is 1.
 * Reference from Integrator repository
 * TODO @Raghu : Can't we use getJSONPaths by adding this enhancement
 * @param {object} dataIn - sample data object.
 * @param {string} prefix
 *
 * @returns {array}
 *
 * @example
 *
 * getTransformPaths({a:'fasd',b:[{c:'d'}], e:[{f:'g'},{f:'g'}]})
 * ["a", "b[0].c", "e[*].f"]
 */
export const getTransformPaths = (dataIn, prefix) => {
  let paths = [];
  let type;

  _.each(dataIn, (v, k) => {
    type = Object.prototype.toString.apply(v);

    if (type === '[object Array]') {
      if (
        Object.prototype.toString.apply(v[0]) === '[object Object]' &&
        !_.isEmpty(v[0])
      ) {
        paths = paths.concat(
          getTransformPaths(
            getUnionObject(v),
            prefix
              ? [prefix, k + (v.length > 1 ? '[*]' : '[0]')].join('.')
              : k + (v.length > 1 ? '[*]' : '[0]')
          )
        );
      } else if (
        Object.prototype.toString.apply(v[0]) === '[object Object]' &&
        _.isEmpty(v[0])
      ) {
        paths.push(prefix ? [prefix, `${k}._`].join('.') : `${k}._`);
      } else {
        paths.push(prefix ? [prefix, k].join('.') : k);
      }
    } else if (type === '[object Object]') {
      paths = paths.concat(
        getTransformPaths(v, prefix ? [prefix, k].join('.') : k)
      );
    } else {
      paths.push(prefix ? [prefix, k].join('.') : k);
    }
  });

  return paths.sort();
};

export function pickFirstObject(param) {
  if (Object.prototype.toString.call(param) === '[object Object]') {
    return param;
  }
  if (_.isArray(param)) {
    if (!!param.length && Array.isArray(param[0])) {
      if (param[0].length) {
        return getUnionObject(param[0]);
      }
    } else {
      return getUnionObject(param);
    }
  }
}

/**
 * Traverses through sampleData object and pushes all valid paths to leaf nodes in to array by
 * wrapping any element with special characters in []
 *
 * @param {object} sampleData - sample data object.
 * @param {string} prefix
 * @param {boolean} wrapSpecialChars
 *
 * @returns {array}
 *
 * @example
 *
 * getJSONPathArrayWithSpecialCharactersWrapped({'a.a':'fasd','b[n':[{c:'d'}], e:[{f:'g'},{f:'g'}]},null, true)
 * // => ["[a.a]", "[b[n][*].c", "e[*].f"]
 */
export function getJSONPathArrayWithSpecialCharactersWrapped(
  sampleData,
  prefix,
  wrapSpecialChars,
  skipSort
) {
  let paths = [];
  let type;

  if (!sampleData || typeof sampleData !== 'object') {
    return paths;
  }

  Object.keys(sampleData).forEach(property => {
    if (property in sampleData) {
      // do stuff
      const v = sampleData[property];
      let k = property;

      if (wrapSpecialChars) {
        k = /\W/.test(k) ? `[${k.replace(/]/g, '\\]')}]` : k;
      }

      type = Object.prototype.toString.apply(v);

      if (type === '[object Array]') {
        if (Object.prototype.toString.apply(v[0]) === '[object Object]') {
          paths = paths.concat(
            getJSONPathArrayWithSpecialCharactersWrapped(
              getUnionObject(v),
              prefix ? [prefix, `${k}[*]`].join('.') : `${k}[*]`,
              wrapSpecialChars
            )
          );
        } else {
          paths.push(prefix ? [prefix, k].join('.') : k);
        }
      } else if (type === '[object Object]' && !_.isEmpty(v)) {
        paths = paths.concat(
          getJSONPathArrayWithSpecialCharactersWrapped(
            v,
            prefix ? [prefix, k].join('.') : k,
            wrapSpecialChars
          )
        );
      } else {
        paths.push(prefix ? [prefix, k].join('.') : k);
      }
    }
  });

  if (skipSort) {
    return paths;
  }

  return paths.sort(celigoListCompare);
}

/**
 * This is a iterator function, where item is single option
 * Expects item to be in the structure {id: 'id', name: 'name'}
 *
 * @param {object} item - single option. should contain id property.
 *
 * @returns {object}
 *
 * @example
 *
 *  data = [
 *   {id: 'Spaced Field'},
 *   {id: 'second[Field]'},
 *   {id: 'list[*].header'},
 *   {id: 'data.field'},
 *   {id: 'spaced field[*].field'}
 * ]
 * data.map(wrapSpecialChars)
 *  =>
 * [
 *   {id: '[Spaced Field]'},
 *   {id: '[second[Field\]]'},
 *   {id: 'list[*].header'},
 *   {id: 'data.field'},
 *   {id: '[spaced field][*].field'}
 * ]
 */
export function wrapSpecialChars(item = {}) {
  if (typeof item !== 'object' || item === null) {
    return item;
  }

  let { id } = item;

  if (/\W/.test(id)) {
    // If option's id has special characters
    // Split by sublist character so sublist options wont be wrapped
    // then, split by a 'dot' character
    // wrap remaining string in [ and ] if contains any special characters and escape closing brace ']' if id has it.
    id = id
      .split('[*].')
      .map(el => el.replace('*.', 'CELIGO_GROUPED_ITEM')
        .split('.')
        .map(el => (/\W/.test(el) ? `[${el.replace(/\]/g, '\\]')}]` : el))
        .join('.')
        .replace('CELIGO_GROUPED_ITEM', '*.')
      )
      .join('[*].');
  }

  return { ...item, id };
}
