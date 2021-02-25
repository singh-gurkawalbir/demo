
import getFieldsWithDefaults from '../getFieldsWithDefaults';

const getFieldsWithoutFuncs = (meta, resource, resourceType) => {
  const transformedMeta = getFieldsWithDefaults(meta, resourceType, resource, {
    ignoreFunctionTransformations: true,
  });
  const { fieldMap: transformedFieldMap } = transformedMeta;
  const extractedInitFunctions = Object.keys(transformedFieldMap)
    .map(key => {
      const field = transformedFieldMap[key];
      const fieldReferenceWithFunc = Object.keys(field)
        .filter(key => typeof field[key] === 'function')
        .reduce((acc, key) => {
          if (field[key]) acc[key] = field[key];

          return acc;
        }, {});

      return { key, value: fieldReferenceWithFunc };
    })
    .filter(val => Object.keys(val.value).length !== 0)
    .reduce((acc, curr) => {
      const { key, value } = curr;

      if (value) {
        acc[key] = value;
      }

      return acc;
    }, {});
  const transformedFieldMapWithoutFuncs = Object.keys(transformedFieldMap)
    .map(key => {
      const field = transformedFieldMap[key];
      const fieldReferenceWithoutFunc = Object.keys(field)
        .filter(key => typeof field[key] !== 'function')
        .reduce((acc, key) => {
          acc[key] = field[key];

          return acc;
        }, {});

      return { key, value: fieldReferenceWithoutFunc };
    })
    .reduce((acc, curr) => {
      const { key, value } = curr;

      acc[key] = value;

      return acc;
    }, {});

  return {
    ...transformedMeta,
    fieldMap: transformedFieldMapWithoutFuncs,
    extractedInitFunctions,
  };
};

export default getFieldsWithoutFuncs;
