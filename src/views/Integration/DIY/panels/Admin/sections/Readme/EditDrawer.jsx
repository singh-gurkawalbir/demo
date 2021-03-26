import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, Button, Typography } from '@material-ui/core';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import CodeEditor from '../../../../../../../components/CodeEditor';
import RawHtml from '../../../../../../../components/RawHtml';
import EditorSaveButton from '../../../../../../../components/ResourceFormFactory/Actions/EditorSaveButton';
import useConfirmDialog from '../../../../../../../components/ConfirmDialog';
import RightDrawer from '../../../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../../../../components/drawer/Right/DrawerFooter';
import ButtonGroup from '../../../../../../../components/ButtonGroup';

const useStyles = makeStyles(theme => ({
  drawerContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  preview: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    overflowY: 'auto',
    flex: 1,
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
  },
  editor: {
    marginBottom: theme.spacing(2),
    height: '50%',
    border: `solid 1px ${theme.palette.secondary.lightest}`,
  },
}));

export default function ReadmeEditor({ value, integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const editorId = 'readme-editor';
  const { cancelDialog } = useConfirmDialog();
  const handleClose = history.goBack;
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
      return handleClose();
    }

    cancelDialog({onSave: handleClose});
  }, [cancelDialog, isEditorDirty, handleClose]);

  useEffect(() => {
    dispatch(
      actions.editor.init(editorId, 'readme', {
        data: value,
        _init_data: value,
        integrationId,
      })
    );
    // we only want to init the editor once per render (onMount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RightDrawer
      path="edit/readme"
      height="tall"
      width="xl"
      variant="temporary"
      onClose={handleClose}>
      <DrawerHeader title="Edit readme" />

      <DrawerContent>
        <div className={classes.drawerContent}>
          <div className={classes.editor}>
            <CodeEditor
              name="readme"
              value={data}
              mode="html"
              onChange={handleChange}
          />
          </div>
          <Typography variant="h4">Preview</Typography>
          <div className={classes.preview}>
            <RawHtml className={classes.previewContainer} html={data} />
          </div>
        </div>
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
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
            onClose={handleClose}
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
        </ButtonGroup>
      </DrawerFooter>
    </RightDrawer>
  );
}
