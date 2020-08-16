import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useRouteMatch, matchPath, useLocation } from 'react-router-dom';
import RightDrawer from '../../../../components/drawer/Right';
import ErrorList from '../../../../components/ErrorList';
import ErrorDetailsTitle from './ErrorDetailsTitle';
import TextToggle from '../../../../components/TextToggle';

export default function ErrorDetailsDrawer({ flowId }) {
  const match = useRouteMatch();
  const location = useLocation();
  const errorDrawerPath = matchPath(location.pathname, {
    path: `${match.path}/errors/:resourceId`,
  });
  const resourceId = errorDrawerPath?.params?.resourceId;
  const [errorType, setErrorType] = useState('open');
  const errorTypes = [
    { label: 'View open errors', value: 'open' },
    { label: 'View resolved errors', value: 'resolved' },
  ];
  const handleErrorTypeChange = useCallback(() => {
    setErrorType(errorType === 'open' ? 'resolved' : 'open');
  }, [errorType]);
  const ErrorTypeToggle = useMemo(() => (
    <TextToggle
      value={errorType}
      onChange={handleErrorTypeChange}
      exclusive
      options={errorTypes}
    />
  ), [errorType, errorTypes, handleErrorTypeChange]);

  useEffect(() => {
    // Used to reset error type when drawer is closed
    if (!resourceId && errorType === 'resolved') {
      setErrorType('open');
    }
  }, [resourceId, errorType]);

  return (
    <RightDrawer
      path="errors/:resourceId"
      width="full"
      title={<ErrorDetailsTitle />}
      actions={ErrorTypeToggle}
      variant="temporary"
      hideBackButton>
      <ErrorList
        flowId={flowId}
        errorType={errorType}
      />
    </RightDrawer>
  );
}
