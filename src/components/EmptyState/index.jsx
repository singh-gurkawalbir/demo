import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import getImageUrl from '../../utils/image';

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
  subTitle: {
    marginBottom: 30,
  },
  title: {
    marginTop: theme.spacing(4),
  },
}));

export default function EmptyState({type, title, subTitle, children}) {
  const classes = useStyles();

  const path = getImageUrl(`images/react/empty-states/${type}.png`);

  return (
    <div className={classes.emptyStatePage}>
      <div className={classes.emptyStateContainer}>
        <img
          className={classes.appLogo}
          src={path}
          type={type}
          alt="Empty State" />
        <Typography variant="h3" className={classes.title}>{title}</Typography>
        {subTitle && <Typography variant="body2" className={classes.subTitle}>{subTitle}</Typography> }
        {children}
      </div>
    </div>
  );
}

EmptyState.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
  altText: PropTypes.string,
  subTitle: PropTypes.string,
  type: PropTypes.string.isRequired,
};
