import { omitBy, reduce } from 'lodash';
import { convertToExport } from '../../../../../utils/assistant';
import { fieldMeta } from './util';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  return {
    ...fieldMeta({ resource, assistantData }),
    optionsHandler(fieldId, fields) {
      return reduce(
        [
          'assistant',
          'adaptorType',
          'version',
          'resource',
          'operation',
          'exportType',
        ],
        (values, fId) => ({
          ...values,
          [fId]: (
            fields.find(field => field.id === `assistantMetadata.${fId}`) || {}
          ).value,
        }),
        {}
      );
    },
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
        assistantData: formValues['/assistantMetadata/assistantData'],
      });

      return { ...otherFormValues, ...exportDoc };
    },
  };
}
