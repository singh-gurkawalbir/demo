import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  small: {
    maxHeight: theme.spacing(4),
  },
  large: {
    maxWidth: theme.spacing(16),
    maxHeight: theme.spacing(16),
  },
});
const iconMap = (type = '') => {
  if (type.toLowerCase().includes('ftp')) return 'ftp';

  if (type.toLowerCase().includes('http')) return 'http';

  if (type.toLowerCase().includes('rest')) return 'rest';

  if (type.toLowerCase().includes('mysql')) return 'mysql';

  if (type.toLowerCase().includes('postgresql')) return 'postgresql';

  if (type.toLowerCase().includes('netsuite')) return 'netsuite';

  if (type.toLowerCase().includes('salesforce')) return 'salesforce';

  if (type.toLowerCase().includes('webhook')) return 'webhook';

  if (type.toLowerCase().includes('mongodb')) return 'mongodb';

  return type;
};

function ApplicationImg(props) {
  const { size = 'small', assistant, type, classes } = props;
  let path;

  if (assistant) {
    path = `${process.env.CDN_BASE_URI}marketplace/${size}/${assistant}.png`;
  } else {
    path = `${
      process.env.CDN_BASE_URI
    }flow-builder/company-logos/integration-icon-${iconMap(type)}.png`;
  }

  return <img className={classes[size]} alt={assistant} src={path} />;
}

export default withStyles(styles)(ApplicationImg);
