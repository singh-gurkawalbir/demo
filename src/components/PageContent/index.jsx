import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  pageWrapper: {
    padding: theme.spacing(2),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.spacing(2)} + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
  },
  pagingBarShow: {
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px +  ${theme.showMoreHeight}px))`,
  },
  pagingBarHide: {
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px))`,
  },

}));
export default function PageContent({children, showPagingBar = false, hidePagingBar = false, className}) {
  const classes = useStyles();

  return (
    <div
      className={clsx(
        classes.pageWrapper,
        {[classes.pagingBarShow]: showPagingBar},
        {[classes.pagingBarHide]: hidePagingBar},
        className)}>
      {children}
    </div>
  );
}

PageContent.propTypes = {
  children: PropTypes.element.isRequired,
  showPagingBar: PropTypes.bool,
  hidePagingBar: PropTypes.bool,
  className: PropTypes.string,
};

PageContent.defaultProps = {
  showPagingBar: false,
  hidePagingBar: false,

};
