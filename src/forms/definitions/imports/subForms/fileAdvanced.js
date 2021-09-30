export default {
  fieldMap: {
    pgpencrypt: {fieldId: 'pgpencrypt'},
    'file.encrypt': { fieldId: 'file.encrypt' },
    'file.pgp.symmetricKeyAlgorithm': { fieldId: 'file.pgp.symmetricKeyAlgorithm' },
    'file.pgp.hashAlgorithm': { fieldId: 'file.pgp.hashAlgorithm' },
  },
  layout: { fields: ['pgpencrypt', 'file.encrypt', 'file.pgp.symmetricKeyAlgorithm', 'file.pgp.hashAlgorithm'] },
};

