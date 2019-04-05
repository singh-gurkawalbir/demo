import commonFormMetaData from '../commonMeta';

export default (fieldsDefs, resourceType) => {
  const commonMeta = commonFormMetaData(fieldsDefs, resourceType);
  // ovveride  name helpKey make it plural
  const arr = ['id', 'name', 'helpKey'];

  // make them plural
  arr.forEach(prop => (commonMeta[prop] += 's'));

  // Making all checkboxes default to false

  //   if (isAPassword(fieldsDefs)) {
  //   }

  return {
    type: 'editor',
    valueType: 'editorExpression',
    ...commonMeta,
  };
};
