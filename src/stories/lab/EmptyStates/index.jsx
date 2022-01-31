import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  emptyStateContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

// {imgSource, title, mainContent, actionItems}

export default function EmptyState() {
  const classes = useStyles();

  return (
    <div className={classes.emptyStateContainer}>
      <img src="" alt="alternate-text" />
      <Typography variant="h2">Jumpstart your integrations</Typography>
      <Typography variant="body2">
        My Integrations is where you will be able to access and monitor all of your integrations. Integrations contain one or more flows grouped together in a folder. Get started on your first integration by selecting Create Integration from the page bar above.
      </Typography>
    </div>
  );
}
