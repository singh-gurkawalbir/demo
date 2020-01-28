import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    padding: '3px 10px',
    // TODO: Azhar why do we center the content? by default we don't want this
    // are there many cases we do want to center this? I can't think of any.
    textAlign: 'center',
    maxWidth: '240px',
    wordBreak: 'break-word',
  },
  content: {
    lineHeight: 'inherit',
  },
});

function TooltipContent(props) {
  const classes = useStyles();
  const { children } = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.content} component="div" variant="body2">
        {children}
      </Typography>
    </div>
  );
}

export default TooltipContent;
