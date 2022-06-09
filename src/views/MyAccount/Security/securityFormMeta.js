export default function getFieldMeta({
  resourceId,
  isSSOEnabled,
  primaryAccountOptions,
  preferences,
  isAccountOwner,
  isAccountOwnerOrAdmin,
  handleEnableSSO,
  oidcClient,
}) {
  const _ssoAccountId = {
    id: '_ssoAccountId',
    type: 'select',
    name: '_ssoAccountId',
    label: 'Primary account',
    required: true,
    options: primaryAccountOptions,
    defaultValue: preferences?._ssoAccountId,
    defaultDisabled: preferences?.authTypeSSO?.sub,
    visible: !isAccountOwner,
  };

  if (!isAccountOwnerOrAdmin) {
    return ({
      fieldMap: {
        _ssoAccountId,
      },
    });
  }

  return ({
    fieldMap: {
      _ssoAccountId,
      enableSSO: {
        id: 'enableSSO',
        type: 'enablesso',
        handleEnableSSO,
        isSSOEnabled,
        resourceId,
      },
      issuerURL: {
        id: 'issuerURL',
        name: 'issuerURL',
        type: 'text',
        label: 'Issuer URL',
        required: true,
        defaultValue: oidcClient?.oidc?.issuerURL,
        helpKey: 'sso.issuerURL',
        noApi: true,
        isLoggable: false,
        visible: isSSOEnabled,
      },
      clientId: {
        id: 'clientId',
        name: 'clientId',
        type: 'text',
        label: 'Client ID',
        required: true,
        defaultValue: oidcClient?.oidc?.clientId,
        helpKey: 'sso.clientId',
        isLoggable: false,
        noApi: true,
        visible: isSSOEnabled,
      },
      clientSecret: {
        id: 'clientSecret',
        name: 'clientSecret',
        type: 'text',
        inputType: 'password',
        label: 'Client secret',
        required: true,
        helpKey: 'sso.clientSecret',
        isLoggable: false,
        noApi: true,
        visible: isSSOEnabled,
      },
      orgId: {
        id: 'orgId',
        name: 'orgId',
        type: 'ssoorgid',
        label: 'Organization ID',
        required: true,
        defaultValue: oidcClient?.orgId,
        helpKey: 'sso.orgId',
        isLoggable: false,
        noApi: true,
        visible: isSSOEnabled,
      },
    },
    layout: {
      type: 'collapse',
      containers: [
        {
          collapsed: false,
          label: 'User settings',
          fields: ['_ssoAccountId'],
        },
        {
          collapsed: false,
          label: 'Account settings',
          containers: [
            {fields: ['enableSSO'] },
            {
              type: 'indent',
              containers: [
                {
                  fields: ['issuerURL', 'clientId', 'clientSecret', 'orgId'],
                },
              ],
            },
          ],
        },
      ],
    },
  });
}
