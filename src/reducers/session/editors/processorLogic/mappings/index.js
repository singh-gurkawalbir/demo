export default {
  processor: 'mapperProcessor',
  init: ({options, resource}) => {
    const importName = resource?.name;
    const editorTitle = importName ? `Edit mapping: ${importName}` : 'Edit Mapping';

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

    let errors = result.data?.[0] || {};
    const hasErrors = !!(result.errors || errors.message || errors.errors?.length);
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

