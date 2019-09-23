export default {
  fieldMap: {
    name: { fieldId: 'name' },
    's3.accessKeyId': { fieldId: 's3.accessKeyId' },
    's3.secretAccessKey': { fieldId: 's3.secretAccessKey' },
    's3.pingBucket': { fieldId: 's3.pingBucket' },
  },
  layout: {
    fields: ['name', 's3.accessKeyId', 's3.secretAccessKey', 's3.pingBucket'],
  },
};
