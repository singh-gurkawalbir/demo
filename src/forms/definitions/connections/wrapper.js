export default {
  preSave: formValues => {
    const newValues = Object.assign({}, formValues);

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
    'wrapper.unencrypted': {
      fieldId: 'wrapper.unencrypted',
      defaultValue: r =>
        r &&
        r.wrapper &&
        r.wrapper.unencrypted &&
        JSON.stringify(r.wrapper.unencrypted),
    },
    'wrapper.encrypted': { fieldId: 'wrapper.encrypted' },
    'wrapper.pingFunction': { fieldId: 'wrapper.pingFunction' },
    'wrapper._stackId': { fieldId: 'wrapper._stackId' },
    wrapperAdvanced: { formId: 'wrapperAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'wrapper.unencrypted',
      'wrapper.encrypted',
      'wrapper.pingFunction',
      'wrapper._stackId',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: ['wrapperAdvanced'],
      },
    ],
  },
};
