import { makeStyles } from '@material-ui/core/styles';
import AppRouting from '../../App/AppRoutingWithAuth';

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  toolbar: theme.mixins.toolbar,
}));

export default function PageContent() {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <AppRouting />
    </main>
  );
}
