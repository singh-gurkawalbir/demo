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
        'trello',
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
    required: true,
  },
  'webhook.slackKey': {
    type: 'textforsetfields',
    label: 'Signing Secret (Slack App Credentials)',
    inputType: 'password',
    helpKey: 'export.webhook.key',
    setFieldIds: ['webhook.url'],
    required: true,
    defaultValue: r => r && r.webhook && r.webhook.key,
    visible: r => r && r.webhook && r.webhook.provider === 'slack',
  },
  'webhook.verify': {
    isLoggable: true,
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
    isLoggable: true,
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
    required: true,
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
    isLoggable: true,
    type: 'selectforsetfields',
    label: 'Encoding',
    required: true,
    setFieldIds: ['webhook.url'],
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Hexadecimal', value: 'hex' },
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
    isLoggable: true,
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
    isLoggable: true,
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
    required: true,
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
        'mailparser-io',
        'sapariba',
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
  'webhook.successStatusCode': {
    label: 'Override HTTP status code for the success responses',
    type: 'select',
    placeholder: 'Do not override',
    options: [
      {
        items: [
          {label: '200', value: 200},
          {label: '202', value: 202},
        ],
      },
    ],
  },
  'webhook.successMediaType': {
    label: 'Override media type for success responses',
    type: 'select',
    placeholder: 'Do not override',
    skipSort: true,
    options: [
      {
        items: [
          {label: 'JSON', value: 'json'},
          {label: 'XML', value: 'xml'},
          {label: 'Plaintext', value: 'plaintext'},
        ],
      },
    ],
  },
  'webhook.successBody': {
    label: 'Override HTTP response body for success responses',
    type: 'uri',
    stage: 'responseMappingExtract',
    showLookup: false,
  },
};
