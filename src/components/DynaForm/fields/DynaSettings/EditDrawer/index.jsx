import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, Button, Typography } from '@material-ui/core';
import actions from '../../../../../actions';
import { isJsonString } from '../../../../../utils/string';
import EditorField from '../../DynaEditor';
import RightDrawer from '../../../../drawer/Right';

const useStyles = makeStyles({
  editor: {
    height: 200,
  },
});

export default function EditDrawer({ resourceId }) {
  const classes = useStyles();
  const history = useHistory();
  const [alteredMeta, setAlteredMeta] = useState();
  const [metaError, setMetaError] = useState();
  const dispatch = useDispatch();
  const handleFormMetaChange = useCallback((id, value) => {
    if (!isJsonString(value)) {
      setMetaError('Form metadata must be valid JSON.');
    } else {
      setMetaError();
    }

    setAlteredMeta(value);
  }, []);
  const handleSaveFormMeta = useCallback(() => {
    // console.log('save form meta!', alteredMeta);
    let meta;

    if (!isJsonString(alteredMeta)) {
      setMetaError('Form metadata must be valid JSON.');

      return;
    }

    dispatch(actions.customSettings.patchForm(resourceId, meta));
    history.goBack();
  }, [alteredMeta, dispatch, history, resourceId]);

  return (
    <RightDrawer
      path="editSettings"
      height="tall"
      width="large"
      title="Edit settings form"
      variant="temporary">
      <EditorField
        label="Form metadata"
        id="settingsForm"
        editorClassName={classes.editor}
        mode="json"
        value={alteredMeta}
        onFieldChange={handleFormMetaChange}
      />
      <Button disabled={!!metaError} onClick={handleSaveFormMeta}>
        Save
      </Button>
      {metaError && <Typography color="error">{metaError}</Typography>}
    </RightDrawer>
  );
}
