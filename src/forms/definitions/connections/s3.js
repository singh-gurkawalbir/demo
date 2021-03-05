export default {
  preSave: formValues => {
    const newValues = formValues;

    if (!newValues['/usePgp']) {
      delete newValues['/pgp/publicKey'];
      delete newValues['/pgp/privateKey'];
      delete newValues['/pgp/passphrase'];
      delete newValues['/pgp/compressionAlgorithm'];
      delete newValues['/pgp/asciiArmored'];
      newValues['/pgp'] = undefined;
    } else if (newValues['/pgp/asciiArmored'] === 'false') {
      newValues['/pgp/asciiArmored'] = false;
    } else {
      newValues['/pgp/asciiArmored'] = true;
    }

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    's3.accessKeyId': { fieldId: 's3.accessKeyId', required: true },
    's3.secretAccessKey': { fieldId: 's3.secretAccessKey', required: true },
    's3.pingBucket': { fieldId: 's3.pingBucket' },
    fileAdvanced: {formId: 'fileAdvanced'},
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
          's3.accessKeyId', 's3.secretAccessKey', 's3.pingBucket',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'fileAdvanced',
        ],
      },
    ],
  },
};
