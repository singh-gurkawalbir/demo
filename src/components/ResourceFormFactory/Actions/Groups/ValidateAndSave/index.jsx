import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import { getAsyncKey } from '../../../../../utils/saveAndCloseButtons';
import { TestSaveAndClose } from '../TestAndSave';
import NetsuiteValidateButton from './NetsuiteValidate';

export default function ValidateAndSave(props) {
  const { resourceId} = props;

  const asyncKey = getAsyncKey('connections', resourceId);

  const isSaveOrTestInProgress = useSelector(state =>
    selectors.isAsyncTaskLoading(state, asyncKey)
  );

  return (
    <TestSaveAndClose {...props} disabled={isSaveOrTestInProgress}>
      <NetsuiteValidateButton {...props} />
    </TestSaveAndClose>
  );
}

