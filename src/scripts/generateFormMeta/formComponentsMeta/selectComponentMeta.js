import commonFormMetaData from '../commonMeta';

const options = fieldDefsOptions =>
  fieldDefsOptions
    .map(def => ({
      label: def.charAt(0).toUpperCase() + def.slice(1),
      value: def,
    }))
    .reduce((acc, currValue) => [...acc, currValue], []);
const selectType = fieldDefsOptions =>
  fieldDefsOptions.options.length >= 3 ? 'select' : 'radiogroup';

export default (fieldsDefs, resourceType) => {
  const optionsFromEnums = {
    options: [{ items: options(fieldsDefs.enumValues) }],
  };
  const commonMeta = commonFormMetaData(fieldsDefs, resourceType);
  const selectElementType = selectType(fieldsDefs);

  return {
    type: selectElementType,
    ...commonMeta,
    ...optionsFromEnums,
  };
};
