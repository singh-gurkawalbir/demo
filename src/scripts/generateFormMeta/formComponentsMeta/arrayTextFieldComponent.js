import commonFormMetaData from '../commonMeta';

export default (fieldsDefs, resourceType) => {
  const commonMeta = commonFormMetaData(fieldsDefs, resourceType);
  // Making all checkboxes default to false
  const arr = ['id', 'name'];

  // make them plural
  arr.forEach(prop => (commonMeta[prop] += 's'));
  const validWhen = [];

  //   if (isAPassword(fieldsDefs)) {
  //   }

  return {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    ...commonMeta,
    validWhen,
  };
};
