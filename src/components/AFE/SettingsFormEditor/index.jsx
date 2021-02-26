import clsx from 'clsx';
import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import actions from '../../../actions';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import { hashCode } from '../../../utils/string';
import { selectors } from '../../../reducers';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import ConsoleGridItem from '../ConsoleGridItem';
import ErrorGridItem from '../ErrorGridItem';
import CodePanel from '../GenericEditor/CodePanel';
import JavaScriptPanel from '../JavaScriptEditor/JavaScriptPanel';
import PanelGrid from '../PanelGrid';
import PanelGridItem from '../PanelGridItem';
import PanelTitle from '../PanelTitle';

/* sample form meta.
  {
    "fieldMap": {
      "A": {
        "id":  "settingA",
        "name": "setA",
        "label": "Label for A",
        "type": "text"
      }
      "B": {
        "id":  "settingB",
        "name": "setB",
        "label": "Turn me on!",
        "type": "checkbox"
      }
    },
    "layout": {"fields": ["A", "B"]}
  }
*/
const useStyles = makeStyles(theme => ({
  gridContainer: {
    gridTemplateColumns: '2fr 2fr',
    gridTemplateRows: '1fr 1fr 0fr',
  },
  jsonGridAreas: {
    gridTemplateAreas: '"meta form" "meta settings" "error error"',
  },
  scriptGridAreas: {
    gridTemplateAreas: '"meta form" "hook settings" "error error"',
  },
  formPreviewContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  testForm: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(1),
  },
  message: {
    margin: theme.spacing(1),
  },
}));

const overrides = { showGutter: false };
export default function SettingsFormEditor({
  editorId,
  disabled,
  resourceId,
  resourceType,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [settingsPreview, setSettingsPreview] = useState();
  const editor = useSelector(state => selectors.editor(state, editorId));
  const { data, result, error, lastChange, mode, status } = editor;
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const handleDataChange = useCallback(
    data => {
      dispatch(actions.editor.patch(editorId, { data }));
    },
    [dispatch, editorId]
  );
  const handleFormPreviewChange = useCallback(values => {
    setSettingsPreview(values);
  }, []);

  // any time the form metadata updates, we need to reset the settings since
  // the form itself could change the shape of the settings.
  useEffect(() => {
    setSettingsPreview();
  }, [lastChange]);

  // console.log(finalMeta);
  const key = useMemo(() => hashCode(result), [result]);
  const logs = result && !error && !violations && result.logs;
  const formKey = useFormInitWithPermissions({
    fieldMeta: result?.data,
    remount: key,
    resourceId,
    resourceType,
  });

  return (
    <PanelGrid
      key={editorId}
      className={clsx(classes.gridContainer, classes[`${mode}GridAreas`])}>
      <PanelGridItem gridArea="meta">
        <PanelTitle
          title={mode === 'json' ? 'Form definition' : 'Script input'}
        />
        <CodePanel
          id="data"
          name="data"
          value={data}
          mode="json"
          readOnly={disabled}
          onChange={handleDataChange}
          skipDelay
        />
      </PanelGridItem>
      {mode === 'script' && (
        <PanelGridItem gridArea="hook">
          <JavaScriptPanel
            disabled={disabled}
            editorId={editorId}
            insertStubKey="formInit"
          />
        </PanelGridItem>
      )}
      <PanelGridItem gridArea="form">
        <PanelTitle title="Form preview" />
        {result && result.data && status !== 'error' ? (
          <div className={classes.formPreviewContainer}>
            <DynaForm
              formKey={formKey}
              className={classes.form}
            />
            <div className={classes.testForm}>
              <DynaSubmit
                formKey={formKey}
                onClick={handleFormPreviewChange}
                >
                Test form
              </DynaSubmit>
            </div>
          </div>
        ) : (
          <Typography className={classes.message}>
            A preview of your settings form will appear once you add some valid
            form metadata or add an init hook.
          </Typography>
        )}
      </PanelGridItem>
      <PanelGridItem gridArea="settings">
        <PanelTitle title="Form output" />
        {settingsPreview ? (
          <CodePanel
            id="result"
            name="result"
            value={settingsPreview}
            mode="json"
            overrides={overrides}
            readOnly
          />
        ) : (
          status !== 'error' && (
            <Typography className={classes.message}>
              Click the ‘test form’ button above to preview form output.
            </Typography>
          )
        )}
      </PanelGridItem>

      <ErrorGridItem error={error} violations={violations} />
      <ConsoleGridItem logs={logs} />
    </PanelGrid>
  );
}
