import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

const styles = theme => ({
  root: {
    padding: '12px',
    minWidth: '120px',
    maxWidth: '270px',
    border: '1px solid',
    borderColor: theme.palette.background.arrowAfter,
    borderRadius: '4px',
    textAlign: 'left',
    overflow: 'hidden',
  },
  title: {
    paddingBottom: '10px',
    textTransform: 'capitalize',
    color: theme.palette.text.title,
  },
  content: {
    lineHeight: 'inherit',
    paddingBottom: '8px',
  },
  action: {
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    paddingTop: '8px',
    width: '100%',
  },
  actionTitle: {
    float: 'left',
    width: '60%',
  },
  actionButtons: {
    float: 'right',
    textAlign: 'right',
    '& Button': {
      borderColor: theme.palette.divider,
      padding: '3px 5px',
      background: 'none',
      float: 'left',
      minWidth: '30px',
      marginRight: '5px',
      textTransform: 'capitalize',
      borderRadius: '2px',
      lineHeight: 'normal',
      fontSize: '12px',
      letterSpacing: '0px',
    },
    '& Button:last-child': {
      marginRight: '0px',
    },
  },
});

function HelpContent(props) {
  const { classes, children, title } = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      <div className={classes.content}>{children}</div>
      <div className={classes.action}>
        <Typography className={classes.actionTitle}>
          Was this helpful?
        </Typography>
        <div className={classes.actionButtons}>
          <Button variant="outlined" color="secondary">
            Yes
          </Button>
          <Button variant="outlined" color="secondary">
            No
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(HelpContent);
