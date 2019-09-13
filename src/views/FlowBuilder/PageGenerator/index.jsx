import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  pgBox: {
    width: 150,
    height: 150,
    border: 'solid 1px lightblue',
    padding: theme.spacing(1),
    margin: theme.spacing(3, 0),
  },
  processorActions: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 1),
  },
  lineRight: {
    top: -theme.spacing(3),
    // none yet
  },
  lineLeft: {
    minWidth: 50,
  },
  dottedLine: {
    position: 'relative',
    borderBottom: `3px dotted ${theme.palette.divider}`,
  },
}));
const PageGenerator = ({ name }) => {
  const classes = useStyles();

  return (
    <div className={classes.pgContainer}>
      <div className={classes.pgBox}>
        <Typography variant="h2">{name}</Typography>
      </div>
      <div className={clsx(classes.dottedLine, classes.lineLeft)} />
    </div>
  );
};

export default PageGenerator;
