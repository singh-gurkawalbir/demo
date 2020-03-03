import { omitBy } from 'lodash';
import { convertToExport } from '../../../../../utils/assistant';
import { fieldMeta } from './util';
import { isJsonString } from '../../../../../utils/string';

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
      const otherFormValues = omitBy(formValues, (v, k) =>
        k.includes('/assistantMetadata/')
      );

      if (Object.hasOwnProperty.call(otherFormValues, '/settings')) {
        let settings = otherFormValues['/settings'];

        if (isJsonString(settings)) {
          settings = JSON.parse(settings);
        } else {
          settings = {};
        }

        otherFormValues['/settings'] = settings;
      }

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
