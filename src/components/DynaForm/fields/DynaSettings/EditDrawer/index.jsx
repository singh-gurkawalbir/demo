import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, Button, Typography } from '@material-ui/core';
import actions from '../../../../../actions';
import { isJsonString } from '../../../../../utils/string';
import CodeEditor from '../../../../CodeEditor';
import RightDrawer from '../../../../drawer/Right';
import DynaForm from '../../../../DynaForm';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    alignItems: 'stretch',
    '& > div': {
      flexGrow: 1,
      flexBasis: '50%',
    },
  },
  editor: {
    height: 500,
  },
});

// TODO: add some more schema validation to this function... possibly we could
// create a "json schema" for the forms metadata and then use a 3rd party schema
// validation tool to perform the test.  It would be too tedious to make this schema
// work for each input type variant, but we could at least test for common interface properties
// required for all inputs. Also move this code into a util.js sibling file and write tests against it to
// ensure validation matches expected business rules.
function isValidFormMetadata(meta) {
  console.log('meta to validate:', meta);

  if (!meta) return false;

  if (!meta.fieldMap) return false;

  if (!meta.layout) return false;

  console.log('meta is valid');

  return true;
}

export default function EditDrawer({ resourceId, settingsForm }) {
  const classes = useStyles();
  const history = useHistory();
  const defaultFormMeta =
    settingsForm && settingsForm.form
      ? JSON.stringify(settingsForm.form, null, 2)
      : '{}';
  const [formKey, setFormKey] = useState(1);
  const [alteredMeta, setAlteredMeta] = useState(defaultFormMeta);
  const [validMeta, setValidMeta] = useState(
    (settingsForm && settingsForm.form) || undefined
  );
  const [metaError, setMetaError] = useState();
  const dispatch = useDispatch();
  const handleFormMetaChange = useCallback(
    value => {
      try {
        const parsedMeta = JSON.parse(value);

        setMetaError();

        if (isValidFormMetadata(parsedMeta)) {
          setValidMeta(parsedMeta);
          setFormKey(formKey + 1); // force re-render.
        } else {
          setMetaError(
            'Your form metadata does not match the required schema.'
          );
        }
      } catch (e) {
        setMetaError('Form metadata must be valid JSON.');
      }

      setAlteredMeta(value);
    },
    [formKey]
  );
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
      <div className={classes.content}>
        <div className={classes.editor}>
          <CodeEditor
            name="settings-form"
            value={alteredMeta}
            mode="json"
            onChange={handleFormMetaChange}
          />
        </div>
        <div>
          {validMeta ? (
            <DynaForm key={formKey} fieldMeta={validMeta} />
          ) : (
            <Typography>
              A preview of your settings form will appear once you add some
              valid form metadata or add an init hook.
            </Typography>
          )}
        </div>
      </div>
      <Button disabled={!!metaError} onClick={handleSaveFormMeta}>
        Save
      </Button>
      {metaError && <Typography color="error">{metaError}</Typography>}
    </RightDrawer>
  );
}
