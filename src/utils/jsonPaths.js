import * as _ from 'lodash';

function getUnionObject(arr) {
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

export default function getJSONPaths(dataIn, prefix, options = {}) {
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
        if (
          Object.prototype.toString.apply(v[0]) === '[object Object]' &&
          !_.isEmpty(v[0])
        ) {
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
