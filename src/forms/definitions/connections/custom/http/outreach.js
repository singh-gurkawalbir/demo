export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'outreach',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.outreach.io',
    '/http/auth/oauth/authURI': 'https://api.outreach.io/oauth/authorize',
    '/http/auth/oauth/tokenURI': 'https://api.outreach.io/oauth/token',
    '/http/auth/oauth/scopeDelimiter': '+',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/oauth/accessTokenPath': 'access_token',
    '/http/auth/oauth/refreshTokenPath': 'refresh_token',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'profile',
        'email',
        'create_prospects',
        'read_prospects',
        'update_prospects',
        'read_sequences',
        'update_sequences',
        'read_tags',
        'read_accounts',
        'create_accounts',
        'read_activities',
        'read_mailings',
        'read_mappings',
        'read_plugins',
        'read_users',
        'create_calls',
        'read_calls',
        'read_call_purposes',
        'read_call_dispositions',
        'accounts.all',
        'accounts.read',
        'accounts.write',
        'accounts.delete',
        'callDispositions.all',
        'callDispositions.read',
        'callDispositions.write',
        'callDispositions.delete',
        'callPurposes.all',
        'callPurposes.read',
        'callPurposes.write',
        'callPurposes.delete',
        'calls.all',
        'calls.read',
        'calls.write',
        'calls.delete',
        'events.all',
        'events.read',
        'events.write',
        'events.delete',
        'mailings.all',
        'mailings.read',
        'mailings.write',
        'mailings.delete',
        'mailboxes.all',
        'mailboxes.read',
        'mailboxes.write',
        'mailboxes.delete',
        'personas.all',
        'personas.read',
        'personas.write',
        'personas.delete',
        'prospects.all',
        'prospects.read',
        'prospects.write',
        'prospects.delete',
        'sequenceStates.all',
        'sequenceStates.read',
        'sequenceStates.write',
        'sequenceStates.delete',
        'sequenceSteps.all',
        'sequenceSteps.read',
        'sequenceSteps.write',
        'sequenceSteps.delete',
        'sequences.all',
        'sequences.read',
        'sequences.write',
        'sequences.delete',
        'stages.all',
        'stages.read',
        'stages.write',
        'stages.delete',
        'taskPriorities.all',
        'taskPriorities.read',
        'taskPriorities.write',
        'taskPriorities.delete',
        'users.all',
        'users.read',
        'users.write',
        'users.delete',
        'tasks.all',
        'tasks.read',
        'tasks.write',
        'tasks.delete',
        'snippets.all',
        'snippets.read',
        'snippets.write',
        'snippets.delete',
        'templates.all',
        'templates.read',
        'templates.write',
        'templates.delete',
        'rulesets.all',
        'rulesets.read',
        'rulesets.write',
        'rulesets.delete',
        'opportunities.all',
        'opportunities.read',
        'opportunities.write',
        'opportunities.delete',
        'opportunityStages.all',
        'opportunityStages.read',
        'opportunityStages.write',
        'opportunityStages.delete',
        'sequenceTemplates.all',
        'sequenceTemplates.read',
        'sequenceTemplates.write',
        'sequenceTemplates.delete',
        'customValidations.all',
        'customValidations.read',
        'customValidations.write',
        'customValidations.delete',
        'webhooks.all',
        'webhooks.read',
        'webhooks.write',
        'webhooks.delete',
        'teams.all',
        'teams.read',
        'teams.write',
        'teams.delete',
        'mailboxContacts.all',
        'mailboxContacts.read',
        'mailboxContacts.write',
        'mailboxContacts.delete',
        'meetingTypes.all',
        'meetingTypes.read',
        'meetingTypes.write',
        'meetingTypes.delete',
        'experiments.all',
        'experiments.read',
        'experiments.write',
        'experiments.delete',
        'phoneNumbers.all',
        'phoneNumbers.read',
        'phoneNumbers.write',
        'phoneNumbers.delete',
        'meetingFields.all',
        'meetingFields.read',
        'meetingFields.write',
        'meetingFields.delete',
        'customDuties.all',
        'customDuties.read',
        'customDuties.write',
        'customDuties.delete',
        'duties.all',
        'duties.read',
        'duties.write',
        'duties.delete',
        'favorites.all',
        'favorites.read',
        'favorites.write',
        'favorites.delete',
        'placeholders.all',
        'placeholders.read',
        'placeholders.write',
        'placeholders.delete',
        'schedules.all',
        'schedules.read',
        'schedules.write',
        'schedules.delete',
        'emailAddresses.all',
        'emailAddresses.read',
        'emailAddresses.write',
        'emailAddresses.delete',
        'audits.all',
        'audits.read',
        'contentCategories.all',
        'contentCategories.read',
        'contentCategories.write',
        'contentCategories.delete',
        'contentCategoryMemberships.all',
        'contentCategoryMemberships.read',
        'contentCategoryMemberships.write',
        'contentCategoryMemberships.delete',
        'contentCategoryOwnerships.all',
        'contentCategoryOwnerships.read',
        'contentCategoryOwnerships.write',
        'contentCategoryOwnerships.delete',
        'mailAliases.all',
        'mailAliases.read',
        'profiles.all',
        'profiles.read',
        'profiles.write',
        'profiles.delete',
        'recipients.all',
        'recipients.read',
        'recipients.write',
        'recipients.delete',
        'roles.all',
        'roles.read',
        'roles.write',
        'roles.delete',
      ],
    },
    application: { id: 'application', type: 'text', label: 'Application', defaultValue: r => r && r.assistant ? r.assistant : r.type, defaultDisabled: true, },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
