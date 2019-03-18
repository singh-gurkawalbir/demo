import commonFormMetaData from '../commonMeta';

export default (fieldsDefs, resourceType) => {
  const commonMeta = commonFormMetaData(fieldsDefs, resourceType);

  // Making all checkboxes default to false
  return {
    type: 'checkbox',
    ...commonMeta,
    defaultValue: false,
  };
};
