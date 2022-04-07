import { omitBy } from 'lodash';
import { convertToExport } from '../../../../../utils/assistant';
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
        'exportType',
        'queryParams',
        'bodyParams',
      ].forEach(prop => {
        assistantMetadata[prop] = formValues[`/assistantMetadata/${prop}`];
      });
      if (assistantMetadata.assistant === 'amazonsellingpartner') {
        assistantMetadata.assistant = 'amazonmws';
      }
      if (assistantMetadata.assistant === 'recurlyv3') {
        assistantMetadata.assistant = 'recurly';
      }
      if (assistantMetadata.assistant === 'loopreturnsv2') {
        assistantMetadata.assistant = 'loopreturns';
      }
      if (assistantMetadata.assistant === 'acumaticaecommerce') {
        assistantMetadata.assistant = 'acumatica';
      }
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

      const exportDoc = convertToExport({
        assistantConfig: assistantMetadata,
        headers: formValues['/assistantMetadata/headers'],
        assistantData: formValues['/assistantMetadata/assistantData'],
      });

      return { ...otherFormValues, ...exportDoc };
    },
  };
}
