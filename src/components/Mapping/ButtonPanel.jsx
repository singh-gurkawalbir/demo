import React, { useCallback } from 'react';
import { ButtonGroup, makeStyles, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import {selectors} from '../../reducers';
import MappingSaveButton from './SaveButton';

const useStyles = makeStyles(theme => ({
  importMappingButtonGroup: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    width: '100%',
    padding: '12px 0px',
    display: 'flex',
    justifyContent: 'space-between',
    '& > div > button': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
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
      <ButtonGroup
        className={classes.importMappingButtonGroup}>
        <div>
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
        </div>

        {showPreviewButton && (
        <Button
          variant="outlined"
          color="primary"
          data-test="preview"
          disabled={!!(disabled || saveInProgress)}
          onClick={handlePreviewClick}>
          Preview
        </Button>
        )}
      </ButtonGroup>
    </>
  );
}
