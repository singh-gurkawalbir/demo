import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  title: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.editor.panelBackground,
    // color: theme.palette.text.main,
    borderBottom: `solid 1px ${theme.editor.panelBorder}`,
  },
}));

export default function PanelTitle(props) {
  const { title, children } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.title}>
      {title ? <Typography variant="body1">{title}</Typography> : children}
    </div>
  );
}
