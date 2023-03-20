import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import PageContent from '../PageContent';

const useStyles = makeStyles({
  tabContentWrapper: {
    '& > [role = tabpanel]': {
      background: 'none',
      padding: 0,
      border: 'none',
    },
  },
});
export default function TabContent({children}) {
  const classes = useStyles();

  return (
    <PageContent className={classes.tabContentWrapper}>{children}</PageContent>
  );
}
