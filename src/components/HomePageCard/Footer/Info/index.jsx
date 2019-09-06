import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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
}));

function Info(props) {
  const classes = useStyles();
  const { variant, label } = props;

  return (
    <div className={classes.wrapper}>
      <Typography variant="body2">{variant}</Typography>
      <Typography variant="body2">{label}</Typography>
    </div>
  );
}

export default Info;
