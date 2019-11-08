import moment from 'moment';

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
      value: r => {
        if (r.status === 'installed') {
          return 'Uninstall';
        } else if (r.status === 'paritallyUninstalled') {
          return 'Resume Uninstall';
        } else if (r.status === 'available') {
          return 'Install';
        } else if (r.status === 'partiallyInstalled') {
          return 'Resume Install';
        }
      },
    },
  ],
};
