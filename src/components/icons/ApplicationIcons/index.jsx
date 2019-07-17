import { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../../FontStager/celigo-fonts/celigo-fonts.css';
import colors from '../../../theme/colors';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '&:div': {
      textAlign: 'center',
      margin: '0px 5px',
    },
  },
  item: {
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
  iconName: {
    color: colors.celigoNeutral6,
  },
});

function ApplicationIcon(props) {
  const { classes } = props;

  return (
    <Fragment>
      <div className={classes.root}>
        <div>
          <p className={classes.item}>
            <i className="cel-icon-add" />
          </p>
          <p className={classes.iconName}>AddIcon</p>
        </div>
        <div>
          <p className={classes.item}>
            <i className="cel-icon-menu-bars" />
          </p>
          <p className={classes.iconName}>MenubarIcon</p>
        </div>
      </div>
    </Fragment>
  );
}

export default withStyles(styles)(ApplicationIcon);
