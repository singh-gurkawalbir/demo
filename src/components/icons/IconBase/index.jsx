import { withStyles } from '@material-ui/core/styles';
import '../../FontStager/celigo-fonts/celigo-fonts.css';
import colors from '../../../theme/colors';

const styles = theme => ({
  root: {
    // jss-nested applies this to all child div nodes
    height: 50,
    width: 50,
    fontSize: 30,
    border: `1px solid${colors.celigoNeutral4}`,
    background: colors.celigoNeutral2,
    padding: theme.spacing.unit,
    borderRadius: '4px',
    margin: theme.spacing.unit - 4,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: '60px',
  },
});

function IconBase({ classes, variant }) {
  return (
    <p className={classes.root}>
      <i className={`cel-icon-${variant}`} />
    </p>
  );
}

export default withStyles(styles)(IconBase);
