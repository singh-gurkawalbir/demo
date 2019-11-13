import moment from 'moment';
import Install from './Actions/AddOns';

export default {
  columns: [
    {
      heading: 'Name',
      value: r => r && r.name,
    },
    {
      heading: 'Description',
      value: r => r.description,
    },
    {
      heading: 'Installed On',
      value: r =>
        r.installedOn ? moment(r.installedOn).format('MMM D, YYYY') : '',
    },
    {
      heading: 'Action',

      value: function Installer(r) {
        return <Install.component resource={r} />;
      },
    },
  ],
};
