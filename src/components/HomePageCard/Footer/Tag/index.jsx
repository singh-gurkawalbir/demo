import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'inline-flex',
    fontSize: 12,
    padding: [[2, 10]],
    justifyContent: 'flex-start',
    border: '2px solid',
    borderColor: theme.palette.divider,
    borderRight: 'none',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: [[4, 0, 0, 4]],
    height: 22,
    '&:before': {
      content: '""',
      top: 1,
      right: -8,
      borderColor: theme.palette.divider,
      borderStyle: 'solid',
      borderWidth: [[0, 2, 2, 0]],
      display: 'inline-block',
      padding: 7,
      transform: `rotate(-45deg)`,
      position: 'absolute',
    },
    '&:after': {
      content: '""',
      top: 4,
      right: -3,
      width: 5,
      height: 5,
      borderRadius: '50%',
      border: '2px solid',
      borderColor: theme.palette.divider,
      position: 'absolute',
    },
  },
  label: {
    maxWidth: 190,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

function Tag(props) {
  const { classes, variant } = props;

  return (
    <div className={classes.wrapper}>
      <span className={classes.label}>{variant}</span>
    </div>
  );
}

export default withStyles(styles)(Tag);
