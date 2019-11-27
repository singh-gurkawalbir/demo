import mappingUtil from '../../../../utils/mapping';

export const preSaveValidate = ({ mappings = [], enquesnackbar }) => {
  const {
    isSuccess,
    errMessage: validationErrMsg,
  } = mappingUtil.validateMappings(mappings);

  if (isSuccess) {
    return true;
  }

  enquesnackbar({
    message: validationErrMsg,
    variant: 'error',
  });

  return false;
};

export default { preSaveValidate };
