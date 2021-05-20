import React, { useCallback } from 'react';
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
  const onRefresh = useCallback(() => {
    handleRefreshClickHandler && handleRefreshClickHandler(header.id);
  }, [handleRefreshClickHandler, header.id]);

  if (!header.supportsRefresh) { return null; }

  if (!isLoading?.[header.id]) {
    return (

      <RefreshIcon
        className={classes.refreshIcon}
        onClick={onRefresh} />
    );
  }

  return <Spinner />;
};

export default function RefreshHeaders({
  hideHeaders = false,
  isLoading = false,
  optionsMap,
  handleRefreshClickHandler,
  dataPublic = false,
}) {
  const classes = useStyles();

  if (hideHeaders) { return null; }

  return (

    <div className={classes.columnsWrapper}>
      {optionsMap.map(header => (
        <div className={classes.header} key={header.id}>
          <span data-public={dataPublic ? true : null} className={classes.label}>{header.label || header.name}</span>
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
