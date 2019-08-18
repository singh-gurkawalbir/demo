import React from 'react';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FontStager from '../components/FontStager';
import themeProvider from './themeProvider';
// import themeProviderOld from '../theme/themeProvider';
import CeligoAppBar from './CeligoAppBar';
import CeligoDrawer from './CeligoDrawer';
import PageContent from './PageContent';

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
  const [open, setOpen] = React.useState(false);

  function handleDrawerClick() {
    setOpen(!open);
  }

  return (
    <MuiThemeProvider theme={theme}>
      <FontStager />
      <CssBaseline />

      <div className={classes.root}>
        <CeligoAppBar shift={open} />
        <CeligoDrawer onClick={handleDrawerClick} open={open} />
        <PageContent shift={open} />
      </div>
    </MuiThemeProvider>
  );
}
