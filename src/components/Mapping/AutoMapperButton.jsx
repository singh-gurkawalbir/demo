import React, { useState, useCallback, useEffect } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import useConfirmDialog from '../ConfirmDialog';
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
  const match = useRouteMatch();
  const [saveTriggered, setSaveTriggered] = useState(false);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();

  const flowHasExport = useSelector(state => {
    const {flowId} = selectors.mapping(state);
    const {adaptorType} = selectors.firstFlowPageGenerator(state, flowId);

    return !!adaptorType;
  });
  const { saveInProgress, saveCompleted, saveTerminated } = useSelector(state => selectors.mappingSaveStatus(state), shallowEqual);
  const mappingsChanged = useSelector(state => selectors.mappingChanged(state));

  const {autoMapperErrorMsg, isFetchingAutoSuggestions} = useSelector(state => {
    const {status, errorMsg} = selectors.autoMapper(state);

    return { isFetchingAutoSuggestions: status === 'requested', autoMapperErrorMsg: errorMsg};
  }, shallowEqual);

  const onSave = useCallback(() => {
    setSaveTriggered(true);
    dispatch(actions.mapping.save({ match }));
  }, [dispatch, match]);

  const handleButtonClick = useCallback(() => {
    if (!mappingsChanged) {
      return dispatch(actions.mapping.autoMapper.request());
    }

    confirmDialog({
      title: 'Confirm auto-mapping',
      message: 'Do you want to save changes before proceeding with Auto-mapping',
      buttons: [
        {
          label: 'Yes',
          color: 'primary',
          onClick: onSave,
        },
        {
          label: 'No',
          onClick: () => dispatch(actions.mapping.autoMapper.request()),
        },
        { label: 'Cancel', color: 'secondary' },
      ],
    });
  },
  [confirmDialog, dispatch, mappingsChanged, onSave]
  );

  useEffect(() => {
    if (autoMapperErrorMsg) {
      enqueueSnackbar({ message: autoMapperErrorMsg, variant: 'error' });
    }
  }, [autoMapperErrorMsg, enqueueSnackbar]);

  useEffect(() => {
    if (saveTriggered && saveTerminated) {
      // only dispatch the auto-mapper request if the pending
      // save mapping operation is successful.
      if (saveCompleted) {
        dispatch(actions.mapping.autoMapper.request());
      }

      setSaveTriggered(false);
    }
  }, [dispatch, saveCompleted, saveTerminated, saveTriggered]);

  if (!flowHasExport) {
    return null;
  }

  const inProgress = saveInProgress || isFetchingAutoSuggestions;
  const progressMessage = saveInProgress ? 'Saving' : 'Auto-mapping';

  return (
    <Button
      color="secondary"
      variant="outlined"
      dataTest="autoMapper"
      disabled={disabled || inProgress}
      onClick={handleButtonClick}
      >
      {(isFetchingAutoSuggestions || inProgress) ? (
        <>
          <Spinner size="small" className={classes.spinner} />
          { progressMessage }
        </>
      ) : 'Auto-map'}
    </Button>
  );
}
