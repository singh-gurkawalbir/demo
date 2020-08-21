import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import RightDrawer from '../../../../components/drawer/Right';
import ErrorList from '../../../../components/ErrorList';
import ErrorDrawerTitle from './ErrorDrawerTitle';
import ErrorDrawerAction from './ErrorDrawerAction';

export default function ErrorDetailsDrawer({ flowId }) {
  const history = useHistory();
  const [errorType, setErrorType] = useState('open');
  const handleClose = useCallback(() => {
    history.goBack();
    setTimeout(() => setErrorType('open'), 1000);
  }, [history]);

  return (
    <RightDrawer
      path="errors/:resourceId"
      width="full"
      title={<ErrorDrawerTitle flowId={flowId} />}
      actions={(
        <ErrorDrawerAction
          flowId={flowId}
          errorType={errorType}
          setErrorType={setErrorType} />
      )}
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
