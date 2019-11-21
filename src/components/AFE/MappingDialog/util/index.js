import mappingUtil from '../../../../utils/mapping';

export const preSaveValidate = ({ mappings = [], enquesnackbar }) => {
  const {
    status: validationStatus,
    message: validationErrMsg,
  } = mappingUtil.validateMappings(mappings);

  if (validationStatus) {
    return true;
  }

  enquesnackbar({
    message: validationErrMsg,
    variant: 'error',
  });

  return false;
};

export default { preSaveValidate };
