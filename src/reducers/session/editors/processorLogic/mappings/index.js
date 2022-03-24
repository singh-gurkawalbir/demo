export default {
  processor: 'mapperProcessor',
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
    if (!result) return;

    const {mappingPreviewType} = editor;

    const hasErrors = !!(result.errors || result.data?.[0]?.errors);
    let errors = result.data?.[0];
    let finalResult = result.data?.[0]?.mappedObject || '';

    if (mappingPreviewType) {
      finalResult = result.data;
      errors = result.errors;
    }

    if (mappingPreviewType === 'netsuite') {
      finalResult = result.data?.data?.returnedObjects?.jsObjects?.data?.[0]?.data;
    }

    if (hasErrors) {
      const errorMessage = [`Message: ${errors.message || errors.errors?.[0]?.message || JSON.stringify(errors)}`];

      throw new Error(errorMessage);
    }

    return { data: finalResult || '' };
  },
};

