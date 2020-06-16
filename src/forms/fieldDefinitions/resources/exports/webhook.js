export default {
  'webhook.key': {
    type: 'textforsetfields',
    label: 'Key (secret)',
    inputType: 'password',
    setFieldIds: ['webhook.url'],
    visible: true,
    visibleWhen: r => {
      const providerList = [
        'github',
        'shipwire',
        'dropbox',
        'shopify',
        'surveymonkey',
        'helpscout',
        'errorception',
        'hubspot',
      ];

      if (
        r &&
        r.webhook &&
        r.webhook.provider &&
        providerList.includes(r.webhook.provider)
      ) return [];

      return [
        {
          field: 'webhook.verify',
          is: ['hmac'],
        },
      ];
    },
  },
  'webhook.slackKey': {
    type: 'textforsetfields',
    label: 'Signing Secret (Slack App Credentials)',
    inputType: 'password',
    helpKey: 'export.webhook.key',
    setFieldIds: ['webhook.url'],
    defaultValue: r => r && r.webhook && r.webhook.key,
    visible: r => r && r.webhook && r.webhook.provider === 'slack',
  },
  'webhook.verify': {
    type: 'selectforsetfields',
    label: 'Verification type',
    required: true,
    setFieldIds: ['webhook.url'],
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'HMAC', value: 'hmac' },
          { label: 'Secret URL', value: 'secret_url' },
          { label: 'Token', value: 'token' },
        ],
      },
    ],
    visible: r => r && r.webhook && r.webhook.provider === 'custom',
  },
  'webhook.algorithm': {
    type: 'selectforsetfields',
    label: 'Algorithm',
    setFieldIds: ['webhook.url'],
    options: [
      {
        items: [
          { label: 'SHA-1', value: 'sha1' },
          { label: 'SHA-256', value: 'sha256' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'webhook.verify',
        is: ['hmac'],
      },
    ],
  },
  'webhook.header': {
    type: 'textforsetfields',
    label: 'Header (containing hmac)',
    required: true,
    setFieldIds: ['webhook.url'],
    visibleWhen: [
      {
        field: 'webhook.verify',
        is: ['hmac'],
      },
    ],
  },
  'webhook.encoding': {
    type: 'selectforsetfields',
    label: 'Encoding',
    required: true,
    setFieldIds: ['webhook.url'],
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Hexadecimal', value: 'hexadecimal' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'webhook.verify',
        is: ['hmac'],
      },
    ],
  },
  'webhook.url': {
    type: 'generateurl',
    label: 'Public URL',
    provider: r => r && r.webhook && r.webhook.provider,
    buttonLabel: 'Generate URL',
    required: true,
  },
  'webhook.username': {
    type: 'text',
    label: 'Username',
    required: true,
    visibleWhen: [
      {
        field: 'webhook.verify',
        is: ['basic'],
      },
    ],
  },
  'webhook.password': {
    type: 'text',
    label: 'Password',
    required: true,
    inputType: 'password',
    visibleWhen: [
      {
        field: 'webhook.verify',
        is: ['basic'],
      },
    ],
  },
  'webhook.path': {
    type: 'textforsetfields',
    label: 'Path',
    required: true,
    setFieldIds: ['webhook.url'],
    visibleWhen: [
      {
        field: 'webhook.verify',
        is: ['token'],
      },
    ],
  },
  'webhook.token': {
    type: 'webhooktokengenerator',
    label: 'Custom URL token',
    buttonLabel: 'Generate new token',
    provider: r => r && r.webhook && r.webhook.provider,
    setFieldIds: ['webhook.url'],
    visible: true,
    visibleWhen: r => {
      const providerList = [
        'travis',
        'box',
        'stripe',
        'aha',
        'jira',
        'pagerduty',
        'postmark',
        'mailchimp',
        'activecampaign',
        'intercom',
        'segment',
        'recurly',
        'travis-org',
        'mailparser',
        'parseur',
      ];

      if (
        r &&
        r.webhook &&
        r.webhook.provider &&
        providerList.includes(r.webhook.provider)
      ) return [];

      return [
        {
          field: 'webhook.verify',
          is: ['secret_url'],
        },
      ];
    },
  },
  'webhook.generateToken': {
    type: 'webhooktokengenerator',
    label: 'Token',
    provider: r => r && r.webhook && r.webhook.provider,
    buttonLabel: 'Generate new token',
    setFieldIds: ['webhook.url'],
    helpKey: 'export.webhook.token',
    defaultValue: r => r && r.webhook && r.webhook.token,
    visibleWhen: [
      {
        field: 'webhook.verify',
        is: ['token'],
      },
    ],
  },
  'webhook.sampledata': {
    id: 'sampleData',
    name: '/sampleData',
    type: 'webhooksampledata',
    helpKey: 'export.webhook.sampledata',
    label: 'Sample data',
  },
};
