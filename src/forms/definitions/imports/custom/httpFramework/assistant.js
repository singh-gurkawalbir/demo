import { omitBy } from 'lodash';
import { updateExportAndImportFinalMetadata } from '../../../../../sagas/utils';
import { convertToImport } from '../../../../../utils/assistant';
import { fieldMeta } from './util';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  return {
    init: (fieldMeta, resource, flow, httpConnector) => updateExportAndImportFinalMetadata(fieldMeta, httpConnector, resource),

    ...fieldMeta({ resource, assistantData }),
    preSave: (formValues = {}) => {
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
        'lookups',
        'existingExtract',
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
        headers: formValues['/assistantMetadata/headers'],
        assistantData: formValues['/assistantMetadata/assistantData'],
      });

      if (importDoc?.['/http']) { importDoc['/http'].formType = 'assistant'; }
      if (!importDoc?.['/assistant']) {
        importDoc['/assistant'] = undefined;
        delete importDoc['/assistant'];
      }

      return { ...otherFormValues, ...importDoc };
    },
  };
}
