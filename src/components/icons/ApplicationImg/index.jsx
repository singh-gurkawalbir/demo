import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  small: {
    maxWidth: theme.spacing.quad,
    maxHeight: theme.spacing.quad,
  },
  large: {
    maxWidth: theme.spacing.quad * 2,
    maxHeight: theme.spacing.quad * 2,
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

  return type;
};

function ApplicationImg(props) {
  const { size = 'small', assistant, type, classes } = props;
  let path;

  if (assistant) {
    path = `${process.env.CDN_BASE_URI}marketplace/small/${assistant}.png`;
  } else {
    path = `${
      process.env.CDN_BASE_URI
    }flow-builder/company-logos/integration-icon-${iconMap(type)}.png`;
  }

  return <img className={classes[size]} alt={assistant} src={path} />;
}

export default withStyles(styles)(ApplicationImg);
