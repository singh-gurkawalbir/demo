import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  small: {
    maxHeight: theme.spacing(4),
  },
  large: {
    maxWidth: theme.spacing(16),
    maxHeight: theme.spacing(16),
  },
}));

function iconMap(type = '') {
  if (type.toLowerCase().includes('ftp')) return 'ftp';

  if (type.toLowerCase().includes('http')) return 'http';

  if (type.toLowerCase().includes('rest')) return 'rest';

  if (type.toLowerCase().includes('mysql')) return 'mysql';

  if (type.toLowerCase().includes('microsoftsql')) return 'mssql';

  if (type.toLowerCase().includes('postgresql')) return 'postgresql';

  if (type.toLowerCase().includes('netsuite')) return 'netsuite';

  if (type.toLowerCase().includes('salesforce')) return 'salesforce';

  if (type.toLowerCase().includes('webhook')) return 'webhook';

  if (type.toLowerCase().includes('mongodb')) return 'mongodb';

  if (type.toLowerCase().includes('dynamodb')) return 'dynamodb';

  if (type.toLowerCase().includes('as2')) return 'as2';

  if (type.toLowerCase().includes('s3')) return 's3';

  if (type.toLowerCase().includes('wrapper')) return 'wrapper';

  if (type.toLowerCase().includes('rdbms')) return 'rdbms';

  // remove all whitespaces
  return type.replace(/\s/g, '');
}

export default function ApplicationImg({
  size = 'small',
  markOnly = false,
  assistant,
  type,
  className,
}) {
  const classes = useStyles();
  let path = `${process.env.CDN_BASE_URI}images/`;

  if (!assistant) {
    path += `flow-builder/company-logos/integration-icon-${iconMap(type)}.png`;
  } else if (markOnly) {
    path += `marketplace/small/${assistant}.png`;
  } else {
    path += `flow-builder/company-logos/integration-icon-${assistant}.png`;
  }

  return (
    <img
      className={clsx(classes[size], className)}
      alt={assistant}
      src={path}
    />
  );
}
