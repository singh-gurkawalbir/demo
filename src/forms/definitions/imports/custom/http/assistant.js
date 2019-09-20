import { omitBy, reduce } from 'lodash';
import { convertToImport } from '../../../../../utils/assistant';
import { fieldMeta } from './util';

export default function assistantDefinition(
  resourceId,
  resource,
  assistantData
) {
  return {
    fields: [{ formId: 'common' }],
    fieldSets: [
      {
        header: 'How would you like the data imported?',
        collapsed: false,
        fields: fieldMeta({ resource, assistantData }),
      },
      {
        header: 'Hooks (Optional, Developers Only)',
        collapsed: false,
        fields: [{ formId: 'hooks' }],
      },
    ],
    optionsHandler(fieldId, fields) {
      return reduce(
        ['assistant', 'adaptorType', 'version', 'resource', 'operation'],
        (values, fieldId) => ({
          ...values,
          [fieldId]: (
            fields.find(field => field.id === `assistantMetadata.${fieldId}`) ||
            {}
          ).value,
        }),
        {}
      );
    },
    preSubmit: formValues => {
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
        'lookupUrl',
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

      // return {};

      return { ...otherFormValues, ...importDoc };
    },
  };
}
