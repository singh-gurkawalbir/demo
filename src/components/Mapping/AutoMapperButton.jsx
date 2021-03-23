import React, { useCallback, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import {selectors} from '../../reducers';
import Spinner from '../Spinner';

export default function AutoMapperButton({disabled}) {
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const flowHasExport = useSelector(state => {
    const {flowId} = selectors.mapping(state);

    if (!flowId) {
      return false;
    }
    const {adaptorType} = selectors.firstFlowPageGenerator(state, flowId);

    return !!adaptorType;
  });
  const isMappingSaveInProgress = useSelector(state => selectors.mappingSaveStatus(state).saveInProgress);
  const {autoMapperErrorMsg, isFetchingAutoSuggestions} = useSelector(state => {
    const {status, errorMsg} = selectors.autoMapper(state);

    return { isFetchingAutoSuggestions: status === 'requested', autoMapperErrorMsg: errorMsg};
  });

  const handleButtonClick = useCallback(() => {
    dispatch(actions.mapping.autoMapper.request());
  }, [dispatch]);

  useEffect(() => {
    // show error message in case of autoMapper error
    if (autoMapperErrorMsg) {
      enquesnackbar({ message: autoMapperErrorMsg, variant: 'error' });
    }
  }, [autoMapperErrorMsg, enquesnackbar]);

  if (!flowHasExport) {
    return null;
  }

  return (
    <Button
      color="secondary"
      variant="outlined"
      dataTest="autoMapper"
      disabled={disabled || isMappingSaveInProgress || isFetchingAutoSuggestions}
      onClick={handleButtonClick}
      >
      {isFetchingAutoSuggestions && (
        <>
          <Spinner size={16} />
          Saving
        </>
      )}
      Suggest mappings - BETA
    </Button>
  );
}
