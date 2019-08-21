import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

export default [
  { label: 'Home', Icon: MailIcon },
  {
    label: 'Tools',
    Icon: MailIcon,
    children: [
      { label: 'Flow Builder', Icon: MailIcon },
      { label: 'Data Loader', Icon: InboxIcon },
    ],
  },
  {
    label: 'Resources',
    Icon: MailIcon,
    children: [
      { label: 'Exports', Icon: MailIcon },
      { label: 'Imports', Icon: InboxIcon },
      { label: 'Connections', Icon: MailIcon },
      { label: 'Integrations', Icon: MailIcon },
    ],
  },
  { label: 'Marketplace', Icon: MailIcon },
  {
    label: 'Support',
    Icon: MailIcon,
    children: [
      { label: 'Knowledge Base', Icon: InboxIcon },
      { label: 'Support Ticket', Icon: MailIcon },
    ],
  },
];
