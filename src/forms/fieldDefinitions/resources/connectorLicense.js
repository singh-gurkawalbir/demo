import moment from 'moment';
import { isNewId } from '../../../utils/resource';

export default {
  expires: {
    defaultValue: r => r.expires && moment(r.expires).format('L'),
    type: 'text',
    label: 'Expiration Date',
  },
  opts: {
    defaultValue: r => r.opts || {},
    type: 'editor',
    mode: 'json',
    label: 'Options',
  },
  sandbox: {
    type: 'checkbox',
    label: 'Sandbox',
  },
  email: {
    defaultValue: r => r.user && r.user.email,
    type: 'text',
    label: 'Email',
    required: true,
    disableText: r => !isNewId(r._id),
  },
};
