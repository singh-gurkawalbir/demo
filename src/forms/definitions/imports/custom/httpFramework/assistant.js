import { omitBy } from 'lodash';
import { convertToImport } from '../../../../../utils/assistant';
import { safeParse } from '../../../../../utils/string';
import { fieldMeta } from './util';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  return {

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
        'createEndpoint',
        'updateEndpoint',
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
      if (assistantMetadata.assistant === 'acumaticaecommerce' || assistantMetadata.assistant === 'acumaticamanufacturing') {
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
      const importDoc = convertToImport({
        assistantConfig: assistantMetadata,
        headers: formValues['/assistantMetadata/headers'],
        assistantData: formValues['/assistantMetadata/assistantData'],
      });

      if (importDoc?.['/http']) { importDoc['/http'].formType = 'assistant'; }
      if (importDoc && !importDoc['/assistant']) {
        importDoc['/assistant'] = undefined;
        delete importDoc['/assistant'];
      }

      if (importDoc && (importDoc['/ignoreExisting'] === true || importDoc['/ignoreMissing'] === true) && importDoc['/http']?.existingExtract && !importDoc['/http']?.ignoreExtract) {
        importDoc['/http/ignoreExtract'] = importDoc['/http'].existingExtract;
        importDoc['/http'].existingExtract = undefined;
        delete importDoc['/http'].existingExtract;
      }
      otherFormValues['/mockResponse'] = safeParse(otherFormValues['/mockResponse']);
      if (Array.isArray(importDoc?.['/assistantMetadata']?.operation)) {
        importDoc['/http/_httpConnectorEndpointIds'] = importDoc['/assistantMetadata'].operation;
        importDoc['/http/_httpConnectorResourceId'] = importDoc['/assistantMetadata'].resource;
        importDoc['/http/_httpConnectorVersionId'] = importDoc['/assistantMetadata'].version;
      } else if (formValues['/assistantMetadata/operation'] && formValues['/assistantMetadata/operation'] !== 'create-update-id') {
        importDoc['/http/_httpConnectorEndpointIds'] = [formValues['/assistantMetadata/operation']];
        importDoc['/http/_httpConnectorResourceId'] = formValues['/assistantMetadata/resource'];
        importDoc['/http/_httpConnectorVersionId'] = formValues['/assistantMetadata/version'];
      }

      return { ...otherFormValues, ...importDoc };
    },
  };
}
