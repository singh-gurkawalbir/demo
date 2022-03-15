import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  pageWrapper: {
    padding: theme.spacing(3, 3, 12),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.spacing(2)}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
  },
  pagingBar: {
    paddingBottom: theme.spacing(3),
  },
}));
export default function PageWrapper({children, isPagingBar = false}) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.pageWrapper, {[classes.pagingBar]: isPagingBar})}>{children}</div>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  isPagingBar: PropTypes.bool,
};

PageWrapper.defaultProps = {
  isPagingBar: false,
};
