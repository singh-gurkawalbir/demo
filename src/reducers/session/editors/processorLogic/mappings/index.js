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

    let errors = result.data?.[0]?.errors;
    let errJSON = result.data?.[0];
    let finalResult = result.data?.[0]?.mappedObject || '';

    if (mappingPreviewType) {
      errors = result.errors;
      errJSON = errors;
      finalResult = result.data;
    }

    if (mappingPreviewType === 'netsuite') {
      finalResult = result.data?.data?.returnedObjects?.jsObjects?.data?.[0]?.data;
    }

    if (errors) {
      const errorMessage = [`Message: ${errJSON.message || errJSON.errors?.[0]?.message || JSON.stringify(errJSON)}`];

      throw new Error(errorMessage);
    }

    return { data: finalResult || '' };
  },
};

