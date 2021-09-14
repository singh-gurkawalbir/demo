import { updatePGPFormValues } from '../../../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updatePGPFormValues(formValues);

    return {
      ...newValues,
      '/type': 'http',
      '/assistant': 'googledrive',
      '/http/auth/type': 'oauth',
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://www.googleapis.com/',
      '/http/auth/token/location': 'header',
      '/http/auth/token/headerName': 'Authorization',
      '/http/auth/token/scheme': 'Bearer',
      '/http/auth/oauth/grantType': 'authorizecode',
      '/http/auth/oauth/authURI': 'https://accounts.google.com/o/oauth2/auth',
      '/http/auth/oauth/tokenURI': 'https://accounts.google.com/o/oauth2/token',
      '/http/auth/oauth/clientCredentialsLocation': 'body',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.appfolder',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.photos.readonly',
        'https://www.googleapis.com/auth/drive.scripts',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.apps.readonly',
        'https://www.googleapis.com/auth/drive.activity',
        'https://www.googleapis.com/auth/drive.activity.readonly',
      ],
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    fileAdvanced: {formId: 'fileAdvanced'},
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      {
        collapsed: true,
        label: 'Configure your client id and secret',
        fields: ['http.auth.oauth.callbackURL', 'http._iClientId', 'http.auth.oauth.scope'],
      },
      { collapsed: true, label: 'Advanced', fields: ['fileAdvanced', 'httpAdvanced'] },
    ],
  },
};

