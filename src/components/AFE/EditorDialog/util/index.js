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
    // validation other transform editors to be added here
  } else if (editor.processor === 'javascript') {
    const { scriptId, entryFunction } = editor;

    if (!scriptId) {
      enquesnackbar({
        message: 'Please select Script ID',
        variant: 'error',
      });

      return false;
    }

    if (!entryFunction) {
      enquesnackbar({
        message: 'Please enter Function name',
        variant: 'error',
      });

      return false;
    }
  }

  return true;
};

export default { preSaveValidate };
