export default {
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
    autoPurgeAt: { fieldId: 'autoPurgeAt' },
    fullAccess: { fieldId: 'fullAccess' },
    _connectionIds: { fieldId: '_connectionIds' },
    _exportIds: { fieldId: '_exportIds' },
    _importIds: { fieldId: '_importIds' },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['name', 'description', 'autoPurgeAt'],
      },
      {
        collapsed: true,
        label: 'Token permissions',
        fields: ['fullAccess',
          '_connectionIds',
          '_exportIds',
          '_importIds'],
      }
    ],
  },
  preSave: (formValues, resource) => {
    const accessTokenData = { ...formValues };

    if (accessTokenData['/autoPurgeAt'] === 'none') {
      delete accessTokenData['/autoPurgeAt'];
    } else if (accessTokenData['/autoPurgeAt'] === 'never') {
      accessTokenData['/autoPurgeAt'] = '';
    } else {
      const currDate = new Date();
      const timeInMilliSeconds = currDate.getTime();

      accessTokenData['/autoPurgeAt'] = new Date(
        timeInMilliSeconds + parseInt(accessTokenData['/autoPurgeAt'], 10)
      ).toISOString();
    }

    if (accessTokenData['/fullAccess'] === 'true') {
      accessTokenData['/_connectionIds'] = [];
      accessTokenData['/_exportIds'] = [];
      accessTokenData['/_importIds'] = [];

      if (!resource._integrationId) {
        accessTokenData['/fullAccess'] = true;
      }
    } else {
      accessTokenData['/fullAccess'] = false;
    }

    if (resource._integrationId) {
      accessTokenData['/fullAccess'] = false; // no need to set this for connector integrations
    }

    return accessTokenData;
  },
};
