import { omitBy } from 'lodash';
import { updateExportAndImportFinalMetadata } from '../../../../../sagas/utils';
import { convertToExport } from '../../../../../utils/assistant';
import { fieldMeta } from './util';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  return {
    init: (fieldMeta, resource, flow, httpConnector) => updateExportAndImportFinalMetadata(fieldMeta, httpConnector, resource),
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

      if (exportDoc?.['/http']) { exportDoc['/http'].formType = 'assistant'; }
      if (exportDoc && !exportDoc['/assistant']) {
        exportDoc['/assistant'] = undefined;
        delete exportDoc['/assistant'];
      }

      return { ...otherFormValues, ...exportDoc };
    },
  };
}
