import { makeStyles } from '@material-ui/core/styles';
import AppRouting from '../AppRouting';

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    overflowX: 'auto',
    height: '100vh',
  },
  toolbar: {
    height: theme.appBarHeight,
  },
}));

export default function PageContent() {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div
        className={
          // This empty div is used to push the scrollable
          // page content below the app/page bars.
          classes.toolbar
        }
      />
      <AppRouting />
    </main>
  );
}
