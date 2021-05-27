import { makeStyles } from '@material-ui/core';
import React from 'react';
import IntegrationTabs from '../../common/Tabs';
import { useAvailableTabs } from '../useAvailableTabs';

const useStyles = makeStyles(theme => ({
  pageWrapper: {
    padding: theme.spacing(3),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
    '& > [role = tabpanel]': {
      background: 'none',
      padding: 0,
      border: 'none',
    },
  },
}));
export default function IntegrationTabsComponent() {
  const classes = useStyles();
  const availableTabs = useAvailableTabs();

  return (

    <IntegrationTabs
      tabs={availableTabs}
      className={classes.pageWrapper}
      />
  );
}
