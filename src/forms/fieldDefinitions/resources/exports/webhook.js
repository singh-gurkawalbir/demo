export default {
  'webhook.provider': {
    type: 'select',
    label: 'Provider',
    options: [
      {
        items: [
          { label: 'GitHub', value: 'github' },
          { label: 'Shipwire', value: 'shipwire' },
          { label: 'Dropbox', value: 'dropbox' },
          { label: 'Shopify', value: 'shopify' },
          { label: 'Help Scout', value: 'helpscout' },
          { label: 'Errorception', value: 'errorception' },
          { label: 'Travis', value: 'travis' },
          { label: 'Slack', value: 'slack' },
          { label: 'Box', value: 'box' },
          { label: 'STRIPE', value: 'stripe' },
          { label: 'Aha!', value: 'aha' },
          { label: 'JIRA', value: 'jira' },
          { label: 'HubSpot', value: 'hubspot' },
          { label: 'SurveyMonkey', value: 'surveymonkey' },
          { label: 'PagerDuty', value: 'pagerduty' },
          { label: 'Postmark', value: 'postmark' },
          { label: 'MailChimp', value: 'mailchimp' },
          { label: 'ActiveCampaign', value: 'activecampaign' },
          { label: 'Intercom', value: 'intercom' },
          { label: 'Segment', value: 'segment' },
          { label: 'Recurly', value: 'recurly' },
          { label: 'Travis Org', value: 'travis-org' },
          { label: 'Mailparser', value: 'mailparser' },
          { label: 'Parseur', value: 'parseur' },
          { label: 'Custom', value: 'custom' },
        ],
      },
    ],
  },
  pageSize: {
    type: 'text',
    label: 'Page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'relativeuri',
    label: 'Data URI Template',
  },
  'webhook.key': {
    type: 'text',
    label: 'Key (Secret)',
    inputType: 'password',
    visibleWhen: [
      {
        field: 'webhook.provider',
        is: [
          'github',
          'shipwire',
          'dropbox',
          'shopify',
          'surveymonkey',
          'helpscout',
          'errorception',
          'hubspot',
        ],
      },
      {
        field: 'webhook.verify',
        is: ['hmac'],
      },
    ],
  },
  'webhook.verify': {
    type: 'select',
    label: 'Verification Type',
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
    visibleWhen: [
      {
        field: 'webhook.provider',
        is: ['custom'],
      },
    ],
  },
  'webhook.algorithm': {
    type: 'select',
    label: 'Algorithm',
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
    type: 'text',
    label: 'Header (Containing HMAC)',
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
  'webhook.encoding': {
    type: 'select',
    label: 'Encoding',
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
  'webhook.username': {
    type: 'text',
    label: 'Username',
    visibleWhenAll: [
      {
        field: 'webhook.provider',
        is: ['custom'],
      },
      {
        field: 'webhook.verify',
        is: ['basic'],
      },
    ],
  },
  'webhook.password': {
    type: 'text',
    label: 'Password',
    visibleWhenAll: [
      {
        field: 'webhook.provider',
        is: ['custom'],
      },
      {
        field: 'webhook.verify',
        is: ['basic'],
      },
    ],
  },
  'webhook.path': {
    type: 'text',
    label: 'Path',
    visibleWhenAll: [
      {
        field: 'webhook.provider',
        is: ['custom'],
      },
      {
        field: 'webhook.verify',
        is: ['token'],
      },
    ],
  },
  'webhook.token': {
    type: 'text',
    label: 'Custom URL Token',
    visibleWhen: [
      {
        field: 'webhook.provider',
        is: [
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
        ],
      },
      {
        field: 'webhook.verify',
        is: ['secret_url', 'token'],
      },
    ],
  },
  security: {
    type: 'labeltitle',
    label: 'Security',
  },
};
