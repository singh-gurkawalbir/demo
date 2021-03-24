import React, { useCallback, useEffect } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import {selectors} from '../../reducers';
import Spinner from '../Spinner';

const useStyles = makeStyles(theme => ({
  spinner: {
    marginRight: theme.spacing(1),
  },
}));
export default function AutoMapperButton({disabled}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const flowHasExport = useSelector(state => {
    const {flowId} = selectors.mapping(state);

    const {adaptorType} = selectors.firstFlowPageGenerator(state, flowId);

    return !!adaptorType;
  });
  const isMappingSaveInProgress = useSelector(state => selectors.mappingSaveStatus(state).saveInProgress);
  const {autoMapperErrorMsg, isFetchingAutoSuggestions} = useSelector(state => {
    const {status, errorMsg} = selectors.autoMapper(state);

    return { isFetchingAutoSuggestions: status === 'requested', autoMapperErrorMsg: errorMsg};
  }, shallowEqual);

  const handleButtonClick = useCallback(() => {
    dispatch(actions.mapping.autoMapper.request());
  }, [dispatch]);

  useEffect(() => {
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
          <Spinner size="small" className={classes.spinner} />
          Saving
        </>
      )}
      Suggest mappings - BETA
    </Button>
  );
}
