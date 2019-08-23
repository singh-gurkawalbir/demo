import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FontStager from '../components/FontStager';
import themeProvider from './themeProvider';
// import themeProviderOld from '../theme/themeProvider';
import CeligoAppBar from './CeligoAppBar';
import CeligoDrawer from './CeligoDrawer';
import PageContent from './PageContent';
import AuthDialog from '../components/AuthDialog';
import AppErroredModal from '../App/AppErroredModal';
import NetworkSnackbar from '../components/NetworkSnackbar';
import * as selectors from '../reducers';

// any css returned by this makeStyles function can not use the theme
// we can only use the theme in components that are children of
// <MuiThemeProvider>
const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});
const theme = themeProvider();

// eslint-disable-next-line
console.log('new theme', theme);

// const oldTheme = themeProviderOld('light');
// console.log('old theme', oldTheme);

export default function AppNew() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const reloadCount = useSelector(state => selectors.reloadCount(state));
  const isAllLoadingCommsAboveThreshold = useSelector(state =>
    selectors.isAllLoadingCommsAboveThreshold(state)
  );

  // useEffect(() => {}, [isAllLoadingCommsAboveThreshold]);

  function handleDrawerToggle() {
    setOpen(!open);
  }

  return (
    <MuiThemeProvider key={reloadCount} theme={theme}>
      <FontStager />
      <CssBaseline />
      <BrowserRouter>
        <div className={classes.root}>
          {isAllLoadingCommsAboveThreshold && <NetworkSnackbar />}
          <CeligoAppBar shift={open} />
          <AppErroredModal />
          <AuthDialog />

          <CeligoDrawer handleDrawerToggle={handleDrawerToggle} open={open} />
          <PageContent shift={open} />
        </div>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}
