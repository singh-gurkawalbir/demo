import { makeStyles } from '@material-ui/core';
import React from 'react';
import EmptyStateImg from '../../../components/icons/EmptyStateImg';
import AppBar from '../../mocks/AppBar';
import PageBar from '../../mocks/PageBar';

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
}));

export default function EmptyState(type, children) {
  const classes = useStyles();

  return (
    <>
      <AppBar>APP BAR IT IS</AppBar>
      <PageBar>Page BAR IT IS</PageBar>
      <div className={classes.emptyStatePage}>
        <div className={classes.emptyStateContainer}>
          <EmptyStateImg
            className={classes.appLogo}
            type={type || 'imports'}
            alt="Application image" />
          {children}
        </div>
      </div>
    </>

  );
}
