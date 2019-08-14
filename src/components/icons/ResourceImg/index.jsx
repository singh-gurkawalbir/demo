import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  small: {
    maxWidth: theme.spacing(4),
    maxHeight: theme.spacing(4),
  },
  large: {
    maxWidth: theme.spacing(8),
    maxHeight: theme.spacing(8),
  },
});
const mapTypes = type => {
  switch (type) {
    case 'exports':
      return 'export';
    case 'imports':
      return 'import';
    case 'asynchelpers':
      return 'export';
    default:
      return type;
  }
};

function ResourceImg(props) {
  const { size = 'small', resourceType, classes } = props;

  return (
    <img
      className={classes[size]}
      alt={resourceType}
      src={`${process.env.CDN_BASE_URI}io-icons/icon-${mapTypes(
        resourceType
      )}.svg`}
    />
  );
}

export default withStyles(styles)(ResourceImg);
