export default {
  'webhook.provider': {
    type: 'selectforsetfields',
    label: 'Provider',
    required: true,
    setFieldIds: ['webhook.url'],
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
          { label: 'Stripe', value: 'stripe' },
          { label: 'Aha!', value: 'aha' },
          { label: 'Jira', value: 'jira' },
          { label: 'HubSpot', value: 'hubspot' },
          { label: 'SurveyMonkey', value: 'surveymonkey' },
          { label: 'PagerDuty', value: 'pagerduty' },
          { label: 'Postmark', value: 'postmark' },
          { label: 'integrator.io Extension', value: 'integrator-extension' },
          { label: 'MailChimp', value: 'mailchimp' },
          { label: 'ActiveCampaign', value: 'activecampaign' },
          { label: 'Intercom', value: 'intercom' },
          { label: 'Segment', value: 'segment' },
          { label: 'Recurly', value: 'recurly' },
          { label: 'Travis Org', value: 'travis-org' },
          { label: 'Mailparser', value: 'mailparser-io' },
          { label: 'Parseur', value: 'parseur' },
          { label: 'Custom', value: 'custom' },
        ],
      },
    ],
  },
  'webhook.key': {
    type: 'textforsetfields',
    label: 'Key (Secret)',
    inputType: 'password',
    setFieldIds: ['webhook.url'],
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
    visibleWhen: [
      {
        field: 'webhook.provider',
        is: ['custom'],
      },
    ],
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
    visibleWhenAll: [
      {
        field: 'webhook.provider',
        isNot: [''],
      },
    ],
  },
  'webhook.username': {
    type: 'text',
    label: 'Username',
    required: true,
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
    required: true,
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
    type: 'textforsetfields',
    label: 'Path',
    required: true,
    setFieldIds: ['webhook.url'],
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
    type: 'webhooktokengenerator',
    label: 'Custom URL Token',
    buttonLabel: 'Generate new token',
    setFieldIds: ['webhook.url'],
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
};
