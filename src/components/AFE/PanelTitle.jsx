import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  title: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.editorInner,
    // color: theme.palette.text.main,
    borderBottom: `solid 1px rgb(0,0,0,0.3)`,
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
