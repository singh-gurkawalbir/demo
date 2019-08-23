import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    paddingTop: 10,
    width: '100%',
    textTransform: 'capitalize',
  },
});

function Info(props) {
  const { classes, variant, label } = props;

  return (
    <div className={classes.wrapper}>
      <Typography variant="body2">{variant}</Typography>
      <Typography variant="body2">{label}</Typography>
    </div>
  );
}

export default withStyles(styles)(Info);
