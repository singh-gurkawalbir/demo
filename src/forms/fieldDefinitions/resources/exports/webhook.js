export default {
  'webhook.key': {
    type: 'textforsetfields',
    label: 'Key (Secret)',
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
      )
        return [];

      return [
        {
          field: 'webhook.verify',
          is: ['hmac'],
        },
      ];
    },
  },
  'webhook.verify': {
    type: 'selectforsetfields',
    label: 'Verification Type',
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
    label: 'Header (Containing HMAC)',
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
    buttonLabel: 'Generate URL',
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
    label: 'Custom URL Token',
    buttonLabel: 'Generate new token',
    setFieldIds: ['webhook.url'],
    visible: true,
    visibleWhen: r => {
      const providerList = [
        'travis',
        'slack',
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
      )
        return [];

      return [
        {
          field: 'webhook.verify',
          is: ['secret_url', 'token'],
        },
      ];
    },
  },
  'webhook.sampledata': {
    id: 'sampleData',
    name: '/sampleData',
    type: 'webhooksampledata',
    label: 'Sample Data',
  },
};
