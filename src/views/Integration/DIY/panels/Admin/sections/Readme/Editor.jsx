import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { Button, Typography } from '@material-ui/core';
import * as selectors from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import CodeEditor from '../../../../../../../components/CodeEditor';
import RawHtml from '../../../../../../../components/RawHtml';
import EditorSaveButton from '../../../../../../../components/ResourceFormFactory/Actions/EditorSaveButton';
import useConfirmDialog from '../../../../../../../components/ConfirmDialog';

const useStyles = makeStyles(theme => ({
  editorContainer: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    height: '40vh',
    margin: theme.spacing(2, 0),
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  previewContainer: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderRadius: 4,
    backgroundColor: theme.palette.background.default,
    height: '30vh',
    padding: theme.spacing(1),
    margin: theme.spacing(2, 0),
    overflow: 'auto',
  },
  wrapper: {
    '& Button': {
      marginRight: theme.spacing(2),
    },
    '& Button:last-child': {
      marginRight: 0,
    },
  },
}));

export default function ReadmeEditor({readmeValue, integrationId, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const editorId = `readme-${integrationId}`;
  const { confirmDialog } = useConfirmDialog();
  const data = useSelector(state => selectors.editor(state, editorId).data);
  const handleChange = useCallback(
    data => {
      dispatch(actions.editor.patch(editorId, { data }));
    },
    [dispatch, editorId]
  );
  const saveInProgress = useSelector(
    state => selectors.editorPatchStatus(state, editorId).saveInProgress
  );
  const isEditorDirty = useSelector(state =>
    selectors.isEditorDirty(state, editorId)
  );

  const handleCancelClick = useCallback(() => {
    if (!isEditorDirty) {
      return onClose();
    }

    confirmDialog({
      title: 'Confirm cancel',
      message: 'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed.',
      buttons: [
        {
          label: 'Yes, cancel',
          onClick: onClose,
        },
        {
          label: 'No, go back',
          color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, isEditorDirty, onClose]);

  useEffect(() => {
    dispatch(
      actions.editor.init(editorId, 'readme', {
        data: readmeValue,
        _init_data: readmeValue,
        integrationId,
      })
    );
    // we only want to init the editor once per render (onMount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={classes.editorContainer}>
        <CodeEditor
          name="readme"
          value={data}
          mode="html"
          onChange={handleChange}
        />
      </div>
      <Typography variant="h4">Preview</Typography>
      <RawHtml className={classes.previewContainer} html={data} />
      <div className={classes.actionContainer}>
        <div className={classes.wrapper}>
          <EditorSaveButton
            id={editorId}
            variant="outlined"
            color="primary"
            dataTest="saveEditor"
            disabled={!isEditorDirty}
            submitButtonLabel="Save"
          />
          <EditorSaveButton
            id={editorId}
            variant="outlined"
            color="secondary"
            dataTest="saveAndCloseEditor"
            disabled={!isEditorDirty}
            onClose={onClose}
            submitButtonLabel="Save & close"
          />
          <Button
            variant="text"
            color="primary"
            data-test="closeEditor"
            onClick={handleCancelClick}
            disabled={!!saveInProgress}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
