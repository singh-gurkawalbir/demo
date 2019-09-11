import { makeStyles, fade } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: '12px',
    minWidth: '212px',
    maxWidth: '270px',
    border: '1px solid',
    borderColor: fade(theme.palette.common.black, 0.2),
    borderRadius: '4px',
    textAlign: 'left',
    overflow: 'hidden',
  },
  title: {
    textTransform: 'capitalize',
    color: theme.palette.text.title,
  },
  content: {
    paddingTop: '10px',
    paddingBottom: '8px',
    maxHeight: '300px',
    overflowY: 'auto',
    color: theme.palette.text.primary,
    fontSize: '14px',
    lineHeight: '22px',
  },
  action: {
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    paddingTop: '8px',
    width: '100%',
    overflow: 'hidden',
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
}));

function HelpContent(props) {
  const classes = useStyles();
  const { children, title, caption } = props;

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      {caption && <Typography variant="caption">{caption}</Typography>}
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

export default HelpContent;
