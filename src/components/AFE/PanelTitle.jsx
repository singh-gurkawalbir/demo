import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  title: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.editor.panelBackground,
    // color: theme.palette.text.main,
    borderBottom: `solid 1px ${theme.editor.panelBorder}`,
  },
});

function PanelTitle(props) {
  const { title, children, classes } = props;

  return (
    <div className={classes.title}>
      {title ? <Typography variant="body1">{title}</Typography> : children}
    </div>
  );
}

export default withStyles(styles)(PanelTitle);
