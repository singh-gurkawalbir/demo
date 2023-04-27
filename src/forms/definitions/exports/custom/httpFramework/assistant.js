import { omitBy } from 'lodash';
import { convertToExport } from '../../../../../utils/assistant';
import { safeParse } from '../../../../../utils/string';
import { fieldMeta } from './util';
import { initializeHttpConnectorForm } from '../../../../metaDataUtils/httpConnectorUtils';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  return {
    init: (fieldMeta, resource) => initializeHttpConnectorForm(fieldMeta, resource, 'exports'),
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
      otherFormValues['/mockOutput'] = safeParse(otherFormValues['/mockOutput']);

      if (formValues['/assistantMetadata/exportType'] !== 'test') {
        otherFormValues['/test/limit'] = undefined;
      }
      if (formValues['/assistantMetadata/operation']) {
        exportDoc['/http/_httpConnectorEndpointId'] = formValues['/assistantMetadata/operation'];
        exportDoc['/http/_httpConnectorResourceId'] = formValues['/assistantMetadata/resource'];
        exportDoc['/http/_httpConnectorVersionId'] = formValues['/assistantMetadata/version'];
      }

      return { ...otherFormValues, ...exportDoc };
    },
  };
}
