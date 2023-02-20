import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import DynaSelect from '../DynaForm/fields/DynaSelect';

const useStyles = makeStyles(theme => ({
  pageWrapper: {
    padding: theme.spacing(2),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.spacing(2)}px + ${theme.pageBarHeight}px))`,
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
  const data = {
    disabled: false,
    id: '_connectionId',
    name: '/_connectionId',
    connectionId: '',
    options: [{
      items: [{
        label: 'Netsuite 616',
        optionSearch: 'Netsuite Connection',
        value: '62f7a541d07aa55c7643a023',
      }, {
        label: 'Amazon Connection',
        optionSearch: 'Amazon Connection',
        value: '34',
      }],
    }],
    required: true,
    label: 'Connection',
    onFieldChange: e => { console.log('test', e); },
    isLoggable: true,
    helpText: 'Choose an existing connection to this application, or click the + icon to create a new connection. You can always change your connection later',
    helpKey: 'pageProcessor.connection',
  };

  return (
    <div
      className={clsx(
        classes.pageWrapper,
        {[classes.pagingBarShow]: showPagingBar},
        {[classes.pagingBarHide]: hidePagingBar},
        className)}>
      <DynaSelect {...data} />
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
