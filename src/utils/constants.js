export const ACCOUNT_IDS = Object.freeze({
  OWN: 'own',
});
export const USER_ACCESS_LEVELS = Object.freeze({
  ACCOUNT_OWNER: 'owner',
  ACCOUNT_MANAGE: 'manage',
  ACCOUNT_MONITOR: 'monitor',
  TILE: 'tile',
});
export const INTEGRATION_ACCESS_LEVELS = Object.freeze({
  OWNER: 'owner',
  MANAGE: 'manage',
  MONITOR: 'monitor',
});
export const TILE_STATUS = Object.freeze({
  IS_PENDING_SETUP: 'is_pending_setup',
  UNINSTALL: 'uninstall',
  HAS_OFFLINE_CONNECTIONS: 'has_offline_connections',
  HAS_ERRORS: 'has_errors',
  SUCCESS: 'success',
});
export const STANDALONE_INTEGRATION = Object.freeze({
  id: 'none',
  name: 'Standalone Flows',
});
export const INTEGRATION_MODES = Object.freeze({
  INSTALL: 'install',
  UNINSTALL: 'uninstall',
  SETTINGS: 'settings',
});
export const PERMISSIONS = Object.freeze({
  accessLevel: 'accessLevel',
  accesstokens: {
    view: 'accesstokens.view',
    create: 'accesstokens.create',
    edit: 'accesstokens.edit',
    delete: 'accesstokens.delete',
  },
  agents: {
    view: 'agents.view',
    create: 'agents.create',
    edit: 'agents.edit',
    delete: 'agents.delete',
  },
  audits: {
    view: 'audits.view',
  },
  connections: {
    view: 'connections.view',
    create: 'connections.create',
    edit: 'connections.edit',
    delete: 'connections.delete',
  },
  connectors: {
    publish: 'connectors.publish',
    view: 'connectors.view',
    create: 'connectors.create',
    edit: 'connectors.edit',
    delete: 'connectors.delete',
  },
  integrations: {
    create: 'integrations.create',
    install: 'integrations.install',
  },
  recyclebin: {
    view: 'recyclebin.view',
    restore: 'recyclebin.restore',
    download: 'recyclebin.download',
    purge: 'recyclebin.purge',
  },
  scripts: {
    view: 'scripts.view',
    create: 'scripts.create',
    edit: 'scripts.edit',
    delete: 'scripts.delete',
  },
  stacks: {
    view: 'stacks.view',
    create: 'stacks.create',
    edit: 'stacks.edit',
    delete: 'stacks.delete',
  },
  subscriptions: {
    view: 'subscriptions.view',
    requestUpgrade: 'subscriptions.requestUpgrade',
  },
  templates: {
    publish: 'templates.publish',
    view: 'templates.view',
    create: 'templates.create',
    edit: 'templates.edit',
    delete: 'templates.delete',
  },
  transfers: {
    view: 'transfers.view',
    create: 'transfers.create',
    edit: 'transfers.edit',
    delete: 'transfers.delete',
  },
  users: {
    view: 'users.view',
    create: 'users.create',
    edit: 'users.edit',
    delete: 'users.delete',
  },
});

export const PASSWORD_MASK = '******';
export const SUITESCRIPT_CONNECTORS = Object.freeze([
  {
    _id: 'suitescript-salesforce-netsuite',
    name: 'Salesforce - NetSuite Connector',
    ssName: 'Salesforce Connector',
    description:
      'Streamline your Lead-to-Cash process with the Salesforce - NetSuite Connector. Manage sales process effectively and in real-time. Packed with Celigo’s deep domain expertise and best practices, this Connector is the embodiment of several years of customer feedback, learning and growth.  With distributed adapters running only in NetSuite and Salesforce, our connector allows endless customization options.',
    applications: ['salesforce', 'netsuite'],
    user: {
      name: 'Celigo',
      email: 'yrjcbv9kkq1azk@gmail.com',
      company: 'Celigo',
    },
  },
  {
    _id: 'suitescript-svb-netsuite',
    name: 'SVB - NetSuite Connector',
    ssName: 'SVB Connector',
    description:
      'The Silicon Valley Bank – NetSuite Connector enables NetSuite customers to automatically import Silicon Valley Bank (SVB) transactions into NetSuite and reconcile efficiently using a wizard-driven process. The Connector offers an intuitive user interface, customized matching logic and automated import of SVB account transactions into NetSuite.',
    applications: ['svb', 'netsuite'],
    user: {
      name: 'Celigo',
      email: 'yrjcbv9kkq1azk@gmail.com',
      company: 'Celigo',
    },
  },
]);
export const JOB_TYPES = Object.freeze({
  FLOW: 'flow',
  IMPORT: 'import',
  EXPORT: 'export',
  RETRY: 'retry',
  BULK_RETRY: 'bulk_retry',
});
export const JOB_STATUS = Object.freeze({
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  FAILED: 'failed',
  QUEUED: 'queued',
  RUNNING: 'running',
  RETRYING: 'retrying',
});
export const PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER = [
  'ashares',
  'licenses',
  'preferences',
  'profile',
  'published',
  'shared/ashares',
];

export const TIMEZONES = [
  {
    value: 'Etc/GMT+12',
    label: '(GMT-12:00) International Date Line West',
  },
  {
    value: 'Pacific/Samoa',
    label: '(GMT-11:00) Midway Island, Samoa',
  },
  {
    value: 'Pacific/Honolulu',
    label: '(GMT-10:00) Hawaii',
  },
  {
    value: 'America/Anchorage',
    label: '(GMT-09:00) Alaska',
  },
  {
    value: 'America/Los_Angeles',
    label: '(GMT-08:00) Pacific Time (US & Canada)',
  },
  {
    value: 'America/Tijuana',
    label: '(GMT-08:00) Tijuana, Baja California',
  },
  {
    value: 'America/Denver',
    label: '(GMT-07:00) Mountain Time (US & Canada)',
  },
  {
    value: 'America/Phoenix',
    label: '(GMT-07:00) Arizona',
  },
  {
    value: 'America/Chihuahua',
    label: '(GMT-07:00) Chihuahua, La Paz, Mazatlan - New',
  },
  {
    value: 'America/Chicago',
    label: '(GMT-06:00) Central Time (US & Canada)',
  },
  {
    value: 'America/Regina',
    label: '(GMT-06:00) Saskatchewan',
  },
  {
    value: 'America/Guatemala',
    label: '(GMT-06:00) Central America',
  },
  {
    value: 'America/Mexico_City',
    label: '(GMT-06:00) Guadalajara, Mexico City, Monterrey - Old',
  },
  {
    value: 'America/New_York',
    label: '(GMT-05:00) Eastern Time (US & Canada)',
  },
  {
    value: 'US/East-Indiana',
    label: '(GMT-05:00) Indiana (East)',
  },
  {
    value: 'America/Bogota',
    label: '(GMT-05:00) Bogota, Lima, Quito',
  },
  {
    value: 'America/Caracas',
    label: '(GMT-04:30) Caracas',
  },
  {
    value: 'America/Halifax',
    label: '(GMT-04:00) Atlantic Time (Canada)',
  },
  {
    value: 'America/La_Paz',
    label: '(GMT-04:00) Georgetown, La Paz, San Juan',
  },
  {
    value: 'America/Manaus',
    label: '(GMT-04:00) Manaus',
  },
  {
    value: 'America/Santiago',
    label: '(GMT-04:00) Santiago',
  },
  {
    value: 'America/St_Johns',
    label: '(GMT-03:30) Newfoundland',
  },
  {
    value: 'America/Sao_Paulo',
    label: '(GMT-03:00) Brasilia',
  },
  {
    value: 'America/Buenos_Aires',
    label: '(GMT-03:00) Buenos Aires',
  },
  {
    value: 'Etc/GMT+3',
    label: '(GMT-03:00) Cayenne',
  },
  {
    value: 'America/Godthab',
    label: '(GMT-03:00) Greenland',
  },
  {
    value: 'America/Montevideo',
    label: '(GMT-03:00) Montevideo',
  },
  {
    value: 'America/Noronha',
    label: '(GMT-02:00) Mid-Atlantic',
  },
  {
    value: 'Etc/GMT+1',
    label: '(GMT-01:00) Cape Verde Is.',
  },
  {
    value: 'Atlantic/Azores',
    label: '(GMT-01:00) Azores',
  },
  {
    value: 'Europe/London',
    label: '(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
  },
  {
    value: 'GMT',
    label: '(GMT) Casablanca',
  },
  {
    value: 'Atlantic/Reykjavik',
    label: '(GMT) Monrovia, Reykjavik',
  },
  {
    value: 'Europe/Warsaw',
    label: '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
  },
  {
    value: 'Europe/Paris',
    label: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
  },
  {
    value: 'Etc/GMT-1',
    label: '(GMT+01:00) West Central Africa',
  },
  {
    value: 'Europe/Amsterdam',
    label: '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
  },
  {
    value: 'Europe/Budapest',
    label: '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
  },
  {
    value: 'Africa/Cairo',
    label: '(GMT+02:00) Cairo',
  },
  {
    value: 'Europe/Istanbul',
    label: '(GMT+02:00) Athens, Bucharest, Istanbul',
  },
  {
    value: 'Asia/Jerusalem',
    label: '(GMT+02:00) Jerusalem',
  },
  {
    value: 'Asia/Amman',
    label: '(GMT+02:00) Amman',
  },
  {
    value: 'Asia/Beirut',
    label: '(GMT+02:00) Beirut',
  },
  {
    value: 'Africa/Johannesburg',
    label: '(GMT+02:00) Harare, Pretoria',
  },
  {
    value: 'Europe/Kiev',
    label: '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
  },
  {
    value: 'Europe/Minsk',
    label: '(GMT+02:00) Minsk',
  },
  {
    value: 'Africa/Windhoek',
    label: '(GMT+02:00) Windhoek',
  },
  {
    value: 'Asia/Riyadh',
    label: '(GMT+03:00) Kuwait, Riyadh',
  },
  {
    value: 'Europe/Moscow',
    label: '(GMT+03:00) Moscow, St. Petersburg, Volgograd',
  },
  {
    value: 'Asia/Baghdad',
    label: '(GMT+03:00) Baghdad',
  },
  {
    value: 'Africa/Nairobi',
    label: '(GMT+03:00) Nairobi',
  },
  {
    value: 'Asia/Tehran',
    label: '(GMT+03:30) Tehran',
  },
  {
    value: 'Asia/Muscat',
    label: '(GMT+04:00) Abu Dhabi, Muscat',
  },
  {
    value: 'Asia/Baku',
    label: '(GMT+04:00) Baku',
  },
  {
    value: 'Asia/Yerevan',
    label: '(GMT+04:00) Caucasus Standard Time',
  },
  {
    value: 'Etc/GMT-3',
    label: '(GMT+04:00) Tbilisi',
  },
  {
    value: 'Asia/Kabul',
    label: '(GMT+04:30) Kabul',
  },
  {
    value: 'Asia/Karachi',
    label: '(GMT+05:00) Islamabad, Karachi',
  },
  {
    value: 'Asia/Yekaterinburg',
    label: '(GMT+05:00) Ekaterinburg',
  },
  {
    value: 'Asia/Tashkent',
    label: '(GMT+05:00) Tashkent',
  },
  {
    value: 'Asia/Calcutta',
    label: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
  },
  {
    value: 'Asia/Katmandu',
    label: '(GMT+05:45) Kathmandu',
  },
  {
    value: 'Asia/Almaty',
    label: '(GMT+06:00) Novosibirsk',
  },
  {
    value: 'Asia/Dacca',
    label: '(GMT+06:00) Astana, Dhaka',
  },
  {
    value: 'Asia/Rangoon',
    label: '(GMT+06:30) Yangon (Rangoon)',
  },
  {
    value: 'Asia/Bangkok',
    label: '(GMT+07:00) Bangkok, Hanoi, Jakarta',
  },
  {
    value: 'Asia/Krasnoyarsk',
    label: '(GMT+07:00) Krasnoyarsk',
  },
  {
    value: 'Asia/Hong_Kong',
    label: '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
  },
  {
    value: 'Asia/Kuala_Lumpur',
    label: '(GMT+08:00) Kuala Lumpur, Singapore',
  },
  {
    value: 'Asia/Taipei',
    label: '(GMT+08:00) Taipei',
  },
  {
    value: 'Australia/Perth',
    label: '(GMT+08:00) Perth',
  },
  {
    value: 'Asia/Irkutsk',
    label: '(GMT+08:00) Irkutsk',
  },
  {
    value: 'Asia/Manila',
    label: '(GMT+08:00) Manila',
  },
  {
    value: 'Asia/Seoul',
    label: '(GMT+09:00) Seoul',
  },
  {
    value: 'Asia/Tokyo',
    label: '(GMT+09:00) Osaka, Sapporo, Tokyo',
  },
  {
    value: 'Asia/Yakutsk',
    label: '(GMT+09:00) Yakutsk',
  },
  {
    value: 'Australia/Darwin',
    label: '(GMT+09:30) Darwin',
  },
  {
    value: 'Australia/Adelaide',
    label: '(GMT+09:30) Adelaide',
  },
  {
    value: 'Australia/Sydney',
    label: '(GMT+10:00) Canberra, Melbourne, Sydney',
  },
  {
    value: 'Australia/Brisbane',
    label: '(GMT+10:00) Brisbane',
  },
  {
    value: 'Australia/Hobart',
    label: '(GMT+10:00) Hobart',
  },
  {
    value: 'Pacific/Guam',
    label: '(GMT+10:00) Guam, Port Moresby',
  },
  {
    value: 'Asia/Vladivostok',
    label: '(GMT+10:00) Vladivostok',
  },
  {
    value: 'Asia/Magadan',
    label: '(GMT+11:00) Magadan, Solomon Is., New Caledonia',
  },
  {
    value: 'Pacific/Kwajalein',
    label: '(GMT+12:00) Fiji, Marshall Is.',
  },
  {
    value: 'Pacific/Auckland',
    label: '(GMT+12:00) Auckland, Wellington',
  },
  {
    value: 'Pacific/Tongatapu',
    label: "(GMT+13:00) Nuku'alofa",
  },
];
