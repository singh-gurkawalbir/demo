import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    padding: '5px',
    textAlign: 'center',
    minWidth: '120px',
    maxWidth: '240px',
  },
  content: {
    textTransform: 'capitalize',
  },
};

function TooltipContent(props) {
  const { classes, title } = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.content}>{title}</Typography>
    </div>
  );
}

export default withStyles(styles)(TooltipContent);
