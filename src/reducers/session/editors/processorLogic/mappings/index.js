import actions from '../../../../../actions';

export default {
  processor: 'mapperProcessor',
  init: ({options, resource, salesforcelayoutId, sObjectType, connectionId, mappingPreviewType}) => {
    const importName = resource?.name;
    const editorTitle = importName ? `Edit Mapping: ${importName}` : 'Edit Mapping';
    let refreshAction;

    console.log('mappingPreviewType', mappingPreviewType);
    if (mappingPreviewType === 'salesforce') {
      const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}/layouts?recordTypeId=${salesforcelayoutId}`;

      refreshAction = actions.metadata.request(connectionId, commMetaPath, {refreshCache: true});
    }
    console.log('refresAction', refreshAction);

    return {
      ...options,
      editorTitle,
      refreshAction,
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

