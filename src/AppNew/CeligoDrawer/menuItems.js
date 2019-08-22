import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

export default [
  { label: 'Home', path: '/', Icon: MailIcon },
  {
    label: 'Tools',
    Icon: MailIcon,
    children: [
      { label: 'Flow builder', path: '/flowbuilder', Icon: MailIcon },
      { label: 'Data loader', path: '/dataloader', Icon: InboxIcon },
    ],
  },
  {
    label: 'Resources',
    Icon: MailIcon,
    children: [
      { label: 'Exports', path: '/exports', Icon: MailIcon },
      { label: 'Imports', path: '/imports', Icon: InboxIcon },
      { label: 'Connections', path: '/connections', Icon: MailIcon },
      { label: 'Scripts', path: '/scripts', Icon: MailIcon },
      { label: 'Agents', path: '/agents', Icon: MailIcon },
    ],
  },
  { label: 'Marketplace', path: '/marketplace', Icon: MailIcon },
  {
    label: 'Support',
    Icon: MailIcon,
    children: [
      { label: 'Knowledge base', Icon: InboxIcon },
      { label: 'Support ticket', Icon: MailIcon },
    ],
  },
  {
    label: 'Dev Tools',
    Icon: MailIcon,
    children: [
      { label: 'App builder', path: '/resources', Icon: InboxIcon },
      { label: 'Editor playground', path: '/editors', Icon: MailIcon },
      {
        label: 'Permission explorer',
        path: '/permissions',
        Icon: InboxIcon,
      },
    ],
  },
];
