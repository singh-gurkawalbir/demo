import moment from 'moment';

export default {
  expires: {
    defaultValue: r => r.expires && moment(r.expires).format('MMMM Do YYYY'),
    type: 'text',
    label: 'Expiration Date',
  },
  created: {
    defaultValue: r => r.created && moment(r.created).format('MMMM Do YYYY'),
    type: 'text',
    label: 'Created Date',
    // visibleWhen: [{ field: 'user.email', isNot: [''] }],
    // disabledWhen: [{ field: 'user.email', isNot: [''] }],
  },
  opts: {
    defaultValue: r => JSON.stringify(r.opts || {}),
    type: 'text',
    label: 'Options',
  },
  sandbox: {
    defaultValue: r => r.sandbox,
    type: 'checkbox',
    label: 'Sandbox',
  },
  email: {
    defaultValue: r => r.user && r.user.email,
    type: 'text',
    label: 'Email',
    required: true,
    // disabledWhen: [{ field: 'created', isNot: [''] }],
  },
};
