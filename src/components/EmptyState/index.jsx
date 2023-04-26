import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import getImageUrl from '../../utils/image';

const useStyles = makeStyles(theme => ({
  emptyStateContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 550,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto',
    '& > *': {
      marginBottom: theme.spacing(2),
      textAlign: 'center',
    },
  },
  subTitle: {
    marginBottom: 30,
  },
  title: {
    marginTop: theme.spacing(4),
    fontFamily: 'Roboto400',
  },
}));

export default function EmptyState({type, title, subTitle, children, className}) {
  const classes = useStyles();

  const path = getImageUrl(`images/react/empty-states/${type}.png`);

  return (
    <div className={clsx(className, classes.emptyStateContainer)}>
      <img
        className={classes.appLogo}
        src={path}
        type={type}
        alt="" />
      {title && <Typography variant="h3" className={classes.title}>{title}</Typography> }
      {subTitle && <Typography variant="body2" className={classes.subTitle}>{subTitle}</Typography> }
      {children}
    </div>
  );
}

EmptyState.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  type: PropTypes.oneOf(['imports', 'connections', 'agents', 'apitokens', 'exports', 'recyclebin', 'integrations']).isRequired,
};
