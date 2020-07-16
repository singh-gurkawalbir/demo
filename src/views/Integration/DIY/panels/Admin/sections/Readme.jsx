import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { Button, Typography } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import PanelHeader from '../../../../../../components/PanelHeader';
import CodeEditor from '../../../../../../components/CodeEditor';
import RawHtml from '../../../../../../components/RawHtml';
import RightDrawer from '../../../../../../components/drawer/Right';
import EditorSaveButton from '../../../../../../components/ResourceFormFactory/Actions/EditorSaveButton';
import useConfirmDialog from '../../../../../../components/ConfirmDialog';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(2),
  },
  editorContainer: {
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    height: '40vh',
    margin: theme.spacing(2, 0),
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
  button: {
    marginRight: theme.spacing(-0.75),
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
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

export default function ReadmeSection({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const { confirmDialog } = useConfirmDialog();
  const editorId = `readme-${integrationId}`;
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const canEditIntegration = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId).edit
  );
  const readmeValue = integration && integration.readme;

  const toggleEditMode = useCallback(() => {
    history.push(`${match.url}/editReadme`);
    // initializing editor again to clearout previous uncommitted changes
    dispatch(
      actions.editor.init(editorId, 'readme', {
        data: readmeValue,
        _init_data: readmeValue,
        integrationId,
      })
    );
  }, [history, match.url, dispatch, editorId, readmeValue, integrationId]);
  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

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

  const editor = useSelector(state => selectors.editor(state, editorId));
  const { data } = editor;
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
      ]
    });
  }, [confirmDialog, isEditorDirty, onClose]);

  const disableSave =
    !editor ||
    editor.error ||
    (isEditorDirty !== undefined && !isEditorDirty);

  return (
    <>
      <PanelHeader title="Readme">
        <Button
          className={classes.button}
          data-test="form-editor-action"
          variant="text"
          onClick={toggleEditMode}>
          Edit readme
        </Button>
      </PanelHeader>
      <div className={classes.root}>
        <RawHtml className={classes.previewContainer} html={readmeValue} />
      </div>
      <RightDrawer
        path="editReadme"
        height="tall"
        width="xl"
        // type="paper"
        title="Edit readme"
        variant="temporary"
        onClose={onClose}>
        <div className={classes.editorContainer}>
          <CodeEditor
            name="readme"
            value={data}
            mode="html"
            readOnly={!canEditIntegration}
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
              disabled={disableSave}
              submitButtonLabel="Save"
            />
            <EditorSaveButton
              id={editorId}
              variant="outlined"
              color="secondary"
              dataTest="saveAndCloseEditor"
              disabled={disableSave}
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
      </RightDrawer>
    </>
  );
}
