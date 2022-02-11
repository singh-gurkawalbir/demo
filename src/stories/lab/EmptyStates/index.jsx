import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { FilledButton } from '../../../components/Buttons';
import { getHelpUrl } from '../../../utils/resource';
import EmptyStateImg from '../../../components/icons/EmptyStateImg';

const useStyles = makeStyles(theme => ({
  emptyStatePage: {
    width: '100%',
    minHeight: '100vh',
    background: theme.palette.background.paper2,
    display: 'flex',
    justifyContent: 'center',
  },
  emptyStateContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 550,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: '30%',
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
  emptyStatelink: {
    textDecoration: 'underline',
  },
}));

// {imgSource, title, mainContent, actionItems}

export default function EmptyState() {
  const classes = useStyles();
  const helpUrl = getHelpUrl();

  return (
    <div className={classes.emptyStatePage}>
      <div className={classes.emptyStateContainer}>
        <EmptyStateImg
          className={classes.appLogo}
          type="imports"
          alt="Application image" />
        <Typography variant="h3">Jumpstart your data integration</Typography>
        <Typography variant="body2">
          You can access, manage, and monitor flows from within integrations on this page.
        </Typography>
        <FilledButton>Create flow </FilledButton>
        <a href={helpUrl} rel="noreferrer" target="_blank" className={classes.emptyStatelink}>
          Learn how to develop integrations in flow builder
        </a>
      </div>
    </div>

  );
}
