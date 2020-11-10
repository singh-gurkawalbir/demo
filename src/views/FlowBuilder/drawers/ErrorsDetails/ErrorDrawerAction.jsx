import { makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import TextToggle from '../../../../components/TextToggle';
import ErrorActionStatus from './ErrorActionStatus';

const useStyles = makeStyles({
  errorDrawerActionToggle: {
    '& > button': {
      whiteSpace: 'nowrap',
    },
  },
});
export default function ErrorDrawerAction(props) {
  const classes = useStyles();
  const { flowId, errorType, setErrorType } = props;
  const match = useRouteMatch();
  const { resourceId } = match?.params || {};
  const errorTypes = [
    { label: 'Open errors', value: 'open' },
    { label: 'Resolved errors', value: 'resolved' },
  ];
  const handleErrorTypeChange = useCallback(() => {
    setErrorType(errorType === 'open' ? 'resolved' : 'open');
  }, [errorType, setErrorType]);

  return (
    <>
      {
        resourceId && (
          <ErrorActionStatus flowId={flowId} resourceId={resourceId} />
        )
      }
      <TextToggle
        value={errorType}
        onChange={handleErrorTypeChange}
        exclusive
        className={classes.errorDrawerActionToggle}
        options={errorTypes}
      />
    </>
  );
}
