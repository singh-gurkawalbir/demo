import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
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
}));

export default function EmptyState({type, altText, title, subTitle, children}) {
  const classes = useStyles();

  return (
    <div className={classes.emptyStatePage}>
      <div className={classes.emptyStateContainer}>
        <EmptyStateImg
          className={classes.appLogo}
          type={type}
          alt={altText} />
        <Typography variant="h3">{title}</Typography>
        {subTitle && <Typography variant="body2">{subTitle}</Typography> }
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
