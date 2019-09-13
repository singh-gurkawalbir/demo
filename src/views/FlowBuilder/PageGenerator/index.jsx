import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const pgBoxSize = 150;
const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  pgBox: {
    width: pgBoxSize,
    height: pgBoxSize,
    border: 'solid 1px lightblue',
    padding: theme.spacing(1),
    margin: theme.spacing(3, 0),
  },
  processorActions: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 1),
  },
  line: {
    borderBottom: `3px dotted ${theme.palette.divider}`,
    width: 50,
  },
  firstLine: {
    position: 'relative',
  },
  connectingLine: {
    top: -(pgBoxSize + theme.spacing(3 * 2)) / 2,
    height: pgBoxSize + theme.spacing(3 * 2),
    position: 'relative',
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
}));
const PageGenerator = ({ _id, name, index /* , isLast */ }) => {
  const classes = useStyles();

  return (
    <div id={_id} className={classes.pgContainer}>
      <div className={classes.pgBox}>
        <Typography variant="h2">{name}</Typography>
      </div>
      <div
        className={clsx(classes.line, {
          [classes.firstLine]: index === 0,
          [classes.connectingLine]: index > 0,
        })}
      />
    </div>
  );
};

export default PageGenerator;
