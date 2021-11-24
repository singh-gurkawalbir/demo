import mappings from '../mappings';
import { generatePostResponseMapData } from '../../../../../utils/flowData';
import { safeParse } from '../../../../../utils/string';

export default {
  processor: 'mapperProcessor',
  init: ({options}) => {
    const {resourceType} = options;
    const mappingType = resourceType === 'exports' ? 'results' : 'response';

    const editorTitle = `Edit ${mappingType} mapping`;

    return {
      ...options,
      editorTitle,
    };
  },
  requestBody: mappings.requestBody,
  validate: mappings.validate,
  processResult: (editor, result) => {
    const {flowInputData} = editor;
    const errors = result?.data?.[0]?.errors;

    if (errors) {
      const errJSON = result.data[0];
      const errorMessage = [`Message: ${errJSON.message || errJSON.errors?.[0]?.message || JSON.stringify(errJSON)}`];

      throw new Error(errorMessage);
    }

    const mappedData = result?.data?.[0]?.mappedObject || '';
    const postResponseMapData = generatePostResponseMapData(
      safeParse(flowInputData),
      mappedData
    );

    return {
      data: Array.isArray(postResponseMapData) ? {
        rows: postResponseMapData,
      } : {
        record: postResponseMapData,
      },
    };
  },
};
