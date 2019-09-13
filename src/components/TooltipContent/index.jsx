import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    padding: '3px 5px',
    textAlign: 'center',
    minWidth: '120px',
    maxWidth: '240px',
  },
  content: {
    textTransform: 'capitalize',
    lineHeight: 'inherit',
  },
});

function TooltipContent(props) {
  const classes = useStyles();
  const { children } = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.content} variant="body2">
        {children}
      </Typography>
    </div>
  );
}

export default TooltipContent;
