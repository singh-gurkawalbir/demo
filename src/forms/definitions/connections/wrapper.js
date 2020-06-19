import { deepClone } from 'fast-json-patch';
import { sortBy } from 'lodash';
import { isNewId } from '../../../utils/resource';


export default {
  init: (fieldMeta, resource = {}) => {
    const newfieldMeta = deepClone(fieldMeta);

    const unEncryptedText = resource.wrapper && resource.wrapper.unencrypted && Object.prototype.toString.apply(resource.wrapper.unencrypted) === '[object Object]' ? JSON.stringify(resource.wrapper.unencrypted) : resource.wrapper.unencrypted;
    let unEncryptedFields = []
    if (resource && resource.wrapper && resource.wrapper.unencryptedFields && resource.wrapper.unencryptedFields.length > 0) {
      resource.wrapper.unencryptedFields.forEach(fld => {
        unEncryptedFields.push({
          position: fld.position,
          field: {
            label: fld.label,
            name: `/wrapper/unencrypted/${fld.id}`,
            id: `wrapper.unencrypted.${fld.id}`,
            fieldId: `wrapper.unencrypted.${fld.id}`,
            type: 'text',
            required: !!fld.required,
            defaultValue: resource && resource.wrapper && resource.wrapper.unencrypted && resource.wrapper.unencrypted[fld.id]
          }
        })
      })
    } else {
      unEncryptedFields.push({
        position: 1,
        field: {
          label: 'Unencrypted:',
          name: '/wrapper/unencrypted',
          id: 'wrapper.unencrypted',
          fieldId: 'wrapper.unencrypted',
          type: 'editor',
          required: true,
          defaultValue: unEncryptedText || '{"field": "value"}'
        }
      })
    }

    if (resource && resource.wrapper && resource.wrapper.encryptedFields && resource.wrapper.encryptedFields.length > 0) {
      resource.wrapper.encryptedFields.forEach((fld) => {
        unEncryptedFields.push({
          position: fld.position,
          field: {
            label: fld.label,
            name: `/wrapper/encrypted/${fld.id}`,
            id: `wrapper.encrypted.${fld.id}`,
            fieldId: `wrapper.encrypted.${fld.id}`,
            type: 'text',
            required: !!fld.required,
            inputType: 'password',
          }
        })
      })
    } else {
      unEncryptedFields.push({
        position: 2,
        field: {
          label: 'Encrypted:',
          name: '/wrapper/encrypted',
          id: 'wrapper.encrypted',
          fieldId: 'wrapper.encrypted',
          type: 'editor',
          required: true,
          defaultValue: (isNewId(resource && resource._id)) ? '{"field": "value"}' : '',
        }
      })
    }

    unEncryptedFields = sortBy(unEncryptedFields, 'position')
    if (unEncryptedFields) {
      for (let i = 0; i < unEncryptedFields.length; i += 1) {
        unEncryptedFields[i] = unEncryptedFields[i].field
        newfieldMeta.fieldMap[unEncryptedFields[i].id] = unEncryptedFields[i];
        if (newfieldMeta.layout.fields) { newfieldMeta.layout.fields.push(unEncryptedFields[i].id); }
      }
    }

    return newfieldMeta;
  },
  preSave: formValues => {
    const newValues = { ...formValues};

    if (newValues['/wrapper/encrypted']) {
      try {
        newValues['/wrapper/encrypted'] = JSON.parse(
          newValues['/wrapper/encrypted']
        );
      } catch (ex) {
        newValues['/wrapper/encrypted'] = undefined;
      }
    }

    if (newValues['/wrapper/unencrypted']) {
      try {
        newValues['/wrapper/unencrypted'] = JSON.parse(
          newValues['/wrapper/unencrypted']
        );
      } catch (ex) {
        newValues['/wrapper/unencrypted'] = undefined;
      }
    }

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'wrapper.pingFunction': { fieldId: 'wrapper.pingFunction' },
    'wrapper._stackId': { fieldId: 'wrapper._stackId' },
    wrapperAdvanced: { formId: 'wrapperAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'application',
        ],
      },
      {
        collapsed: true,
        label: 'Application details',
        fields: [
          'wrapper.pingFunction',
          'wrapper._stackId',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['wrapperAdvanced'],
      },
    ],
  },
};
