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
    fields: [
      'name',
      'description',
      'autoPurgeAt',
      'fullAccess',
      '_connectionIds',
      '_exportIds',
      '_importIds',
    ],
  },

  preSave: formValues => {
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
      accessTokenData['/fullAccess'] = true;
    } else {
      accessTokenData['/fullAccess'] = false;
    }

    return accessTokenData;
  },
};
