import commonFormMetaData from '../commonMeta';

export default (fieldsDefs, resourceType) => {
  const commonMeta = commonFormMetaData(fieldsDefs, resourceType);

  return {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    ...commonMeta,
  };
};
