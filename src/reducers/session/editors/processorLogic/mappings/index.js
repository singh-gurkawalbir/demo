export default {
  processor: 'mapperProcessor',
  skipPreview: ({layout}) => layout === 'assistantRight',
  init: ({options, resource}) => {
    const importName = resource?.name;
    const editorTitle = importName ? `Edit Mapping: ${importName}` : 'Edit Mapping';

    return {
      ...options,
      editorTitle,
    };
  },
  requestBody: () => ({
    // handled in invokeProcessor saga
  }),
  validate: editor => editor.violations || {},
  processResult: (editor, result) => {
    const errors = result?.data?.[0]?.errors;

    if (errors) {
      const errJSON = result.data[0];
      const errorMessage = [`Message: ${errJSON.message || errJSON.errors?.[0]?.message || JSON.stringify(errJSON)}`];

      throw new Error(errorMessage);
    }

    return {
      data: result?.data?.[0]?.mappedObject || '',
    };
  },
};

