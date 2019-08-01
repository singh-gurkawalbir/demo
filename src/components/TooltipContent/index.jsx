import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
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
};

function TooltipContent(props) {
  const { classes, children } = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.content}>{children}</Typography>
    </div>
  );
}

export default withStyles(styles)(TooltipContent);
