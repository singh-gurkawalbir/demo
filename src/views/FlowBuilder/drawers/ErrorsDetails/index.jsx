import React, { useCallback, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import RightDrawer from '../../../../components/drawer/Right';
import ErrorList from '../../../../components/ErrorList';
import ErrorDetailsTitle from './ErrorDetailsTitle';
import TextToggle from '../../../../components/TextToggle';

export default function ErrorDetailsDrawer({ flowId }) {
  const history = useHistory();
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
  const handleClose = useCallback(() => {
    history.goBack();
    setErrorType('open');
  }, [history]);

  return (
    <RightDrawer
      path="errors/:resourceId"
      width="full"
      title={<ErrorDetailsTitle />}
      actions={ErrorTypeToggle}
      onClose={handleClose}
      variant="temporary"
      hideBackButton>
      <ErrorList
        flowId={flowId}
        errorType={errorType}
      />
    </RightDrawer>
  );
}
