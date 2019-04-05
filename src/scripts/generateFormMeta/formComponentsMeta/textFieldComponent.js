import commonFormMetaData from '../commonMeta';

// const isAPassword = fieldDefs =>
//   fieldDefs && fieldDefs.path && fieldDefs.path.endsWith('_crypt');
const isANumberField = fieldDefs =>
  fieldDefs && fieldDefs.instance && fieldDefs.instance === 'Number';
const getNumberValidators = fieldDefs => fieldDefs && fieldDefs.validators;
const matchesRegEx = {
  pattern: '^[\\d]+$',
  message: 'Only numbers allowed',
};
const minMaxMetaGen = fieldDefs => {
  const numberMinMax = getNumberValidators(fieldDefs);
  let fallsWithinNumericalRange = {};

  if (numberMinMax && numberMinMax.min && !numberMinMax.max) {
    fallsWithinNumericalRange = {
      min: numberMinMax.min,
      message: `The value must be greater than ${numberMinMax.min}`,
    };
  } else if (numberMinMax && !numberMinMax.min && numberMinMax.max) {
    fallsWithinNumericalRange = {
      max: numberMinMax.max,
      message: `The value must be lesser than ${numberMinMax.max}`,
    };
  } else {
    fallsWithinNumericalRange = {
      min: numberMinMax.min,
      max: numberMinMax.max,
      message: `The value must be greater than ${
        numberMinMax.max
      } and  lesser than ${numberMinMax.max}`,
    };
  }

  return { fallsWithinNumericalRange };
};

export default (fieldsDefs, resourceType) => {
  const commonMeta = commonFormMetaData(fieldsDefs, resourceType);
  // Making all checkboxes default to false
  let validWhen = [];

  if (isANumberField(fieldsDefs)) {
    validWhen.push({ matchesRegEx });

    // add further validation if it exists
    if (getNumberValidators(fieldsDefs).length > 0) {
      validWhen.push(minMaxMetaGen(fieldsDefs));
    }
  }

  if (validWhen.length === 0) validWhen = undefined;

  //   if (isAPassword(fieldsDefs)) {
  //   }
  return {
    type: 'text',
    ...commonMeta,
    validWhen,
  };
};
