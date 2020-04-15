import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import AppBlock from '../AppBlock';

const useStyles = makeStyles(theme => ({
  ppContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  lineRight: {
    minWidth: 130,
  },
  lineLeft: {
    minWidth: 50,
  },
  dottedLine: {
    alignSelf: 'start',
    marginTop: 84,
    borderBottom: `3px dotted ${theme.palette.divider}`,
  },
  pending: {
    minWidth: 50,
  },
}));
const PageProcessor = () => {
  const classes = useStyles();
  // Returns map of all possible actions with true/false whether actions performed on the resource

  return (
    <div className={classes.ppContainer}>
      {/* Initial left line connecting Source Apps */}
      <div className={clsx(classes.dottedLine, classes.lineLeft)} />
      <AppBlock blockType="import" />
    </div>
  );
};

export default withRouter(PageProcessor);
