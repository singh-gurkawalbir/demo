import React, { useCallback } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import ButtonGroup from '../ButtonGroup';
import actions from '../../actions';
import {selectors} from '../../reducers';
import MappingSaveButton from './SaveButton';

const useStyles = makeStyles(theme => ({
  importMappingButtonGroup: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    width: '100%',
    padding: theme.spacing(2, 1, 0, 0),
    display: 'block',
    marginLeft: theme.spacing(3),
  },
  previewButton: {
    float: 'right',
  },
}));
export default function ButtonPanel({flowId, importId, disabled, onClose}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const saveInProgress = useSelector(
    state => selectors.mappingSaveStatus(state).saveInProgress
  );
  const isNSAssistantFormLoaded = useSelector(state => selectors.mapping(state).isNSAssistantFormLoaded);
  const mappingPreviewType = useSelector(state =>
    selectors.mappingPreviewType(state, importId)
  );

  const handlePreviewClick = useCallback(() => {
    dispatch(actions.mapping.requestPreview());
  }, [dispatch]);
  const showPreviewButton = !!(mappingPreviewType === 'netsuite'
    ? isNSAssistantFormLoaded
    : mappingPreviewType);

  return (
    <>
      <ButtonGroup>
        <MappingSaveButton
          disabled={!!(disabled || saveInProgress)}
          color="primary"
          dataTest="saveImportMapping"
          submitButtonLabel="Save"
          flowId={flowId}
          />
        <MappingSaveButton
          variant="outlined"
          color="secondary"
          dataTest="saveAndCloseImportMapping"
          onClose={onClose}
          disabled={!!(disabled || saveInProgress)}
          submitButtonLabel="Save & close"
          flowId={flowId}
          />
        <Button
          variant="text"
          data-test="saveImportMapping"
          disabled={!!saveInProgress}
          onClick={onClose}>
          Cancel
        </Button>
        {showPreviewButton && (
        <Button
          variant="outlined"
          color="primary"
          data-test="preview"
          className={classes.previewButton}
          disabled={!!(disabled || saveInProgress)}
          onClick={handlePreviewClick}>
          Preview
        </Button>
        )}
      </ButtonGroup>
    </>
  );
}
