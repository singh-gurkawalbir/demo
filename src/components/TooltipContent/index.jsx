import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    padding: '3px 10px',
    textAlign: 'center',
    maxWidth: '240px',
    wordBreak: 'break-word',
  },
  content: {
    textTransform: 'capitalize',
    lineHeight: 'inherit',
  },
});

function TooltipContent(props) {
  const classes = useStyles();
  const { children, className } = props;

  return (
    <div className={clsx(classes.root, className)}>
      <Typography className={classes.content} variant="body2">
        {children}
      </Typography>
    </div>
  );
}

export default TooltipContent;
