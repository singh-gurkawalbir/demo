import React from 'react';
import { makeStyles } from '@material-ui/core';
import Spinner from '../../../../../Spinner';
import RefreshIcon from '../../../../../icons/RefreshIcon';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    paddingRight: theme.spacing(1),
  },
  columnsWrapper: {
    width: '95%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gridGap: '8px',
    marginBottom: theme.spacing(1),
  },
  refreshIcon: {
    cursor: 'pointer',
  },
}));

const RefreshComponent = ({handleRefreshClickHandler, header, isLoading}) => {
  const classes = useStyles();

  if (!header.supportsRefresh) { return null; }

  if (!isLoading?.[header.id]) {
    return (

      <RefreshIcon
        className={classes.refreshIcon}
        onClick={
         () => {
           handleRefreshClickHandler && handleRefreshClickHandler(header.id);
         }
        } />
    );
  }

  return <Spinner />;
};

export default function RefreshHeaders({
  hideHeaders = false,
  isLoading = false,
  optionsMap,
  handleRefreshClickHandler,
}) {
  const classes = useStyles();

  if (hideHeaders) { return null; }

  return (

    <div className={classes.columnsWrapper}>
      {optionsMap.map(header => (
        <div className={classes.header} key={header.id}>
          <span className={classes.label}>{header.label || header.name}</span>
          <RefreshComponent
            isLoading={isLoading}
            header={header}
            handleRefreshClickHandler={handleRefreshClickHandler}
          />
        </div>
      ))}

    </div>

  );
}
