import { omitBy } from 'lodash';
import { convertToImport } from '../../../../../utils/assistant';
import { fieldMeta } from './util';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  return {
    ...fieldMeta({ resource, assistantData }),
    preSave: formValues => {
      const assistantMetadata = {
        pathParams: {},
      };

      [
        'adaptorType',
        'assistant',
        'version',
        'resource',
        'operation',
        'ignoreExisting',
        'ignoreMissing',
        // 'lookupUrl',
        'lookupType',
        'lookupQueryParams',
      ].forEach(prop => {
        assistantMetadata[prop] = formValues[`/assistantMetadata/${prop}`];
      });
      const otherFormValues = omitBy(formValues, (v, k) =>
        k.includes('/assistantMetadata/')
      );

      Object.keys(formValues).forEach(key => {
        if (key.includes('/assistantMetadata/pathParams/')) {
          assistantMetadata.pathParams[
            key.replace('/assistantMetadata/pathParams/', '')
          ] = formValues[key];
        }
      });
      const importDoc = convertToImport({
        assistantConfig: assistantMetadata,
        assistantData: formValues['/assistantMetadata/assistantData'],
      });

      return { ...otherFormValues, ...importDoc };
    },
  };
}
