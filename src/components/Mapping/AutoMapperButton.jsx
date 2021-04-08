import React, { useState, useCallback, useEffect } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import useConfirmDialog from '../ConfirmDialog';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import {selectors} from '../../reducers';
import Spinner from '../Spinner';
import Help from '../Help';

const useStyles = makeStyles(theme => ({
  spinner: {
    marginRight: theme.spacing(1),
  },
  helpTextButton: {
    padding: 0,
    marginLeft: theme.spacing(1),
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

  const handleAutoMapperRequest = useCallback(() =>
    dispatch(actions.mapping.autoMapper.request()), [dispatch]);

  const onSave = useCallback(() => {
    setSaveTriggered(true);
    dispatch(actions.mapping.save({ match }));
  }, [dispatch, match]);

  const handleButtonClick = useCallback(() => {
    if (!mappingsChanged) {
      return handleAutoMapperRequest();
    }

    confirmDialog({
      title: 'Save changes and auto-map fields?',
      message: `Auto-mapping automatically adds export fields mapped to suggested import fields, 
                but will not change any fields that you have already mapped. You can manually 
                delete or modify fields after they have been auto-mapped.`,
      buttons: [
        {
          label: 'Save changes & auto-map fields',
          variant: 'primary',
          onClick: onSave,
        },
        {
          label: 'Discard changes & auto-map fields',
          variant: 'secondary',
          onClick: handleAutoMapperRequest,
        },
        { label: 'Cancel', variant: 'tertiary' },
      ],
    });
  },
  [confirmDialog, handleAutoMapperRequest, mappingsChanged, onSave]
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

  return (
    <>
      <Button
        color="primary"
        variant="outlined"
        dataTest="autoMapper"
        disabled={disabled || inProgress}
        onClick={handleButtonClick}
      >
        {(isFetchingAutoSuggestions || inProgress) ? (
          <>
            <Spinner size="small" className={classes.spinner} />
            Auto-mapping fields
          </>
        ) : 'Auto-map fields'}
      </Button>
      <Help
        title="Auto-map fields" helpKey="autoMapFields" className={classes.helpTextButton}
 />
    </>
  );
}
