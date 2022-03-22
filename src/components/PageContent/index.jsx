import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  pageWrapper: {
    padding: theme.spacing(2),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.spacing(2)}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
  },
  pagingBar: {
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px +  ${theme.showMoreHeight}px))`,
  },
  pageWrapperWithIntegrationTabs: {
    '& > [role = tabpanel]': {
      background: 'none',
      padding: 0,
      border: 'none',
    },
  },
}));
export default function PageContent({children, isPagingBar = false, isIntegrationTabsWrapper = false, className}) {
  const classes = useStyles();

  return (
    <div
      className={clsx(
        classes.pageWrapper,
        {[classes.pagingBar]: isPagingBar},
        {[classes.pageWrapperWithIntegrationTabs]: isIntegrationTabsWrapper},
        className)}>{children}
    </div>
  );
}

PageContent.propTypes = {
  children: PropTypes.element.isRequired,
  isPagingBar: PropTypes.bool,
  className: PropTypes.string,
  isIntegrationTabsWrapper: PropTypes.bool,
};

PageContent.defaultProps = {
  isPagingBar: false,
  isIntegrationTabsWrapper: false,
};
