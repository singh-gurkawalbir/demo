import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    padding: '3px 10px',
    width: 350,
    wordBreak: 'break-word',
    lineHeight: 'inherit',
  },
});

function TooltipContent({ children }) {
  const classes = useStyles();

  return (
    <Typography className={classes.root} component="div" variant="body2">
      {children}
    </Typography>
  );
}

export default TooltipContent;
