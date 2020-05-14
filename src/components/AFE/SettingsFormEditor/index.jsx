import { makeStyles, Typography } from '@material-ui/core';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import * as selectors from '../../../reducers';
import { hashCode } from '../../../utils/string';
import DynaForm from '../../DynaForm';
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
const useStyles = makeStyles({
  gridContainer: {
    gridTemplateColumns: '2fr 2fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"meta form" "hook settings" "error error"',
  },
});

function getData(form) {
  return JSON.stringify(
    {
      resource: {
        settingsForm: { form },
      },
      parentResource: {},
      license: {},
      parentLicense: {},
      sandbox: false,
    },
    null,
    2
  );
}

export default function SettingsFormEditor({
  editorId,
  settingsForm = {},
  disabled,
  resourceId,
  resourceType,
}) {
  const { form, init = {} } = settingsForm;
  const classes = useStyles();
  const dispatch = useDispatch();
  // console.log(editorId, 'settingsForm:', settingsForm);
  const editor = useSelector(state => selectors.editor(state, editorId));
  const settings = useSelector(
    state => selectors.resource(state, resourceType, resourceId).settings
  );
  const { data, result, error } = editor;
  // console.log('editor', editor);
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const handleDataChange = useCallback(
    data => {
      dispatch(actions.editor.patch(editorId, { data }));
    },
    [dispatch, editorId]
  );

  useEffect(() => {
    const data = getData(form);

    dispatch(
      actions.editor.init(editorId, 'settingsForm', {
        scriptId: init._scriptId,
        initScriptId: init._scriptId,
        entryFunction: init.function || 'main',
        initEntryFunction: init.function || 'main',
        data,
        initData: data,
        fetchScriptContent: true, // @Adi: what is this?
        autoEvaluate: true,
        autoEvaluateDelay: 200,
        resourceId,
        resourceType,
        settings,
        previewOnSave: true,
      })
    );
  }, [
    dispatch,
    editorId,
    form,
    init._scriptId,
    init.function,
    resourceId,
    resourceType,
    settings,
  ]);
  // any time the form metadata updates, we need to reset the settings since
  // the form itself could change the shape of the settings.

  // console.log(finalMeta);
  const key = useMemo(() => hashCode(result), [result]);
  const logs = result && !error && !violations && result.logs;
  const formKey = useFormInitWithPermissions({
    fieldsMeta: result,
    remount: key,
    resourceId,
    resourceType,
  });
  // TODO:verify this behaviour
  const { value: settingsPreview, isValid: settingsValid } = useSelector(
    state => selectors.getFormState(state, formKey)
  );

  return (
    <PanelGrid
      key={editorId}
      className={classes.gridContainer}
      height="calc(100vh - 170px)"
      width="100%">
      <PanelGridItem gridArea="meta">
        <PanelTitle title="Form metadata" />
        <CodePanel
          id="data"
          name="data"
          value={data}
          mode="json"
          readOnly={disabled}
          onChange={handleDataChange}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="hook">
        <JavaScriptPanel
          disabled={disabled}
          editorId={editorId}
          insertStubKey="formInit"
        />
      </PanelGridItem>
      <PanelGridItem gridArea="form">
        <PanelTitle title="Form Preview" />
        {result ? (
          <DynaForm formKey={formKey} fieldMeta={result} />
        ) : (
          <Typography>
            A preview of your settings form will appear once you add some valid
            form metadata or add an init hook.
          </Typography>
        )}
      </PanelGridItem>
      <PanelGridItem gridArea="settings">
        <PanelTitle
          title={
            settingsValid
              ? 'Settings preview'
              : 'Settings preview (currently invalid)'
          }
        />
        {settingsPreview ? (
          <CodePanel
            id="result"
            name="result"
            value={settingsPreview}
            mode="json"
            overrides={{ showGutter: false }}
            readOnly
          />
        ) : (
          <Typography>
            Use the form above to preview the raw settings.
          </Typography>
        )}
      </PanelGridItem>

      <ErrorGridItem error={error} violations={violations} />
      <ConsoleGridItem logs={logs} />
    </PanelGrid>
  );
}
