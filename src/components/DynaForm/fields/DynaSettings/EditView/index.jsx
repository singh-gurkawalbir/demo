import { useState, useCallback, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Button, Typography } from '@material-ui/core';
import actions from '../../../../../actions';
import { isJsonString } from '../../../../../utils/string';
import EditorField from '../../DynaEditor';

const useStyles = makeStyles({
  editor: {
    height: 200,
  },
});

export default function EditView({ resourceId, onToggleClick }) {
  const classes = useStyles();
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
    onToggleClick();
  }, [alteredMeta, dispatch, onToggleClick, resourceId]);

  return (
    <Fragment>
      <Button variant="contained" onClick={onToggleClick}>
        Toggle form editor
      </Button>
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
    </Fragment>
  );
}
