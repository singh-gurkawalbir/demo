export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'ofxserver.username': { fieldId: 'ofxserver.username' },
    'ofxserver.password': { fieldId: 'ofxserver.password' },
    'ofxserver.sandbox': { fieldId: 'ofxserver.sandbox' },
  },
  layout: {
    fields: [
      'name',
      'ofxserver.username',
      'ofxserver.password',
      'ofxserver.sandbox',
    ],
    type: 'collapse',
  },
};
