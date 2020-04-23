import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, Button, Typography } from '@material-ui/core';
import actions from '../../../../../actions';
// import { isJsonString } from '../../../../../utils/string';
import CodeEditor from '../../../../CodeEditor';
import RightDrawer from '../../../../drawer/Right';
import DynaForm from '../../../../DynaForm';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    display: 'grid',
    gridGap: theme.spacing(2),
    alignItems: 'stretch',
    height: 'calc(100vh - 170px)', // full height - drawer header/footer.
    gridTemplateColumns: '3fr 2fr',
    gridTemplateRows: '3fr 2fr 0fr',
    gridTemplateAreas: '"code form" "code settings" "error error"',
  },
  codeArea: {
    gridArea: 'code',
  },
  formArea: {
    gridArea: 'form',
  },
  settingsArea: {
    gridArea: 'settings',
  },
  errorArea: {
    gridArea: 'error',
  },
}));

// TODO: add some more schema validation to this function... possibly we could
// create a "json schema" for the forms metadata and then use a 3rd party schema
// validation tool to perform the test.  It would be too tedious to make this schema
// work for each input type variant, but we could at least test for common interface properties
// required for all inputs. Also move this code into a util.js sibling file and write tests against it to
// ensure validation matches expected business rules.
function isValidFormMetadata(meta) {
  // console.log('meta to validate:', meta);

  if (!meta) return false;

  if (!meta.fieldMap) return false;

  if (!meta.layout) return false;

  // console.log('meta is valid');

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
  const [previewValues, setPreviewValues] = useState({});
  const [validMeta, setValidMeta] = useState(
    (settingsForm && settingsForm.form) || undefined
  );
  const [errorMessage, setErrorMessage] = useState();
  const dispatch = useDispatch();
  const handleFormMetaChange = useCallback(
    value => {
      try {
        const parsedMeta = JSON.parse(value);

        setErrorMessage();

        if (isValidFormMetadata(parsedMeta)) {
          setValidMeta(parsedMeta);
          setFormKey(formKey + 1); // force re-render.
        } else {
          setErrorMessage(
            'Your form metadata does not match the required schema.'
          );
        }
      } catch (e) {
        setErrorMessage('Form metadata must be valid JSON.');
      }

      setAlteredMeta(value);
    },
    [formKey]
  );
  const handleFormPreviewChange = useCallback((values, isValid) => {
    setPreviewValues(values);
    setErrorMessage(isValid ? '' : 'Some settings are currently invalid');
  }, []);
  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleSave = useCallback(() => {
    // console.log('save form meta!', alteredMeta);

    dispatch(actions.customSettings.patchForm(resourceId, alteredMeta));
    history.goBack();
  }, [alteredMeta, dispatch, history, resourceId]);

  return (
    <RightDrawer
      path="editSettings"
      height="tall"
      width="large"
      type="paper"
      title="Edit settings form"
      variant="temporary">
      <div className={classes.gridContainer}>
        <div className={classes.codeArea}>
          <CodeEditor
            name="settings-form"
            value={alteredMeta}
            mode="json"
            onChange={handleFormMetaChange}
          />
        </div>
        <div className={classes.formArea}>
          {validMeta ? (
            <DynaForm
              key={formKey}
              fieldMeta={validMeta}
              onChange={handleFormPreviewChange}
            />
          ) : (
            <Typography>
              A preview of your settings form will appear once you add some
              valid form metadata or add an init hook.
            </Typography>
          )}
        </div>
        <div className={classes.settingsArea}>
          <CodeEditor
            key={previewValues}
            name="settings"
            value={previewValues}
            mode="json"
            readOnly
          />
        </div>
        {errorMessage && (
          <div className={classes.errorArea}>
            <Typography color="error">{errorMessage}</Typography>
          </div>
        )}
      </div>
      <Button disabled={!!errorMessage} onClick={handleSave}>
        Save
      </Button>
      <Button disabled={!!errorMessage} onClick={handleCancel}>
        Cancel
      </Button>
    </RightDrawer>
  );
}
