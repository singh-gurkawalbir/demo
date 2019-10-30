import arrayUtil from '../../../../utils/array';

export const preSaveValidate = ({ editor = {}, enquesnackbar }) => {
  if (editor.processor === 'transform') {
    const duplicates = arrayUtil.getDuplicateValues(
      editor.rule,
      editor.duplicateKeyToValidate
    );

    if (duplicates && duplicates.length) {
      enquesnackbar({
        message: `You have duplicate mappings for the field(s): ${duplicates.join(
          ','
        )}`,
        variant: 'error',
      });

      return false;
    }
  }

  // validation other transform editors to be added here

  return true;
};

export default { preSaveValidate };
