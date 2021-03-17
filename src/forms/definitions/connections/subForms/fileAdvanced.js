export default {
  fieldMap: {
    usePgp: { fieldId: 'usePgp' },
    'pgp.publicKey': {
      fieldId: 'pgp.publicKey',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'usePgp', is: [true] }],
    },
    'pgp.privateKey': {
      fieldId: 'pgp.privateKey',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'usePgp', is: [true] }],
    },
    'pgp.passphrase': {
      fieldId: 'pgp.passphrase',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'usePgp', is: [true] }],
    },
    'pgp.compressionAlgorithm': {
      fieldId: 'pgp.compressionAlgorithm',
      omitWhenHidden: true,
      visibleWhen: [
        { field: 'usePgp', is: [true] },
      ],
    },
    'pgp.asciiArmored': {
      fieldId: 'pgp.asciiArmored',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'usePgp', is: [true] }],
    },
  },
  layout: {
    fields: ['usePgp',
      'pgp.publicKey',
      'pgp.privateKey',
      'pgp.passphrase',
      'pgp.compressionAlgorithm',
      'pgp.asciiArmored'],
  },
};

