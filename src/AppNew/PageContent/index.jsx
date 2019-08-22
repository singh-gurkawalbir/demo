import { makeStyles } from '@material-ui/core/styles';
import CeligoPageBar from '../CeligoPageBar';
import AppRouting from '../../App/AppRoutingWithAuth';

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

export default function PageContent({ shift = false }) {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <CeligoPageBar shift={shift} />
      <AppRouting />
    </main>
  );
}
