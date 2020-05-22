import clsx from 'clsx';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { hashCode } from '../../../utils/string';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import CodePanel from '../GenericEditor/CodePanel';
import JavaScriptPanel from '../JavaScriptEditor/JavaScriptPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import ConsoleGridItem from '../ConsoleGridItem';

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
  submitButton: {
    marginLeft: theme.spacing(1),
  },
}));

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
  const { data, result, error, lastChange, mode } = editor;
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

  return (
    <PanelGrid
      key={editorId}
      className={clsx(classes.gridContainer, classes[`${mode}GridAreas`])}
      height="calc(100vh - 170px)"
      width="100%">
      <PanelGridItem gridArea="meta">
        <PanelTitle
          title={mode === 'json' ? 'Form Definition' : 'Script Input'}
        />
        <CodePanel
          id="data"
          name="data"
          value={data}
          mode="json"
          readOnly={disabled}
          onChange={handleDataChange}
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
        <PanelTitle title="Form Preview" />
        {result ? (
          <DynaForm
            key={key}
            fieldMeta={result}
            // onChange={handleFormPreviewChange}
            resourceId={resourceId}
            resourceType={resourceType}>
            <DynaSubmit
              className={classes.submitButton}
              onClick={handleFormPreviewChange}>
              Test Form Submission
            </DynaSubmit>
          </DynaForm>
        ) : (
          <Typography>
            A preview of your settings form will appear once you add some valid
            form metadata or add an init hook.
          </Typography>
        )}
      </PanelGridItem>
      <PanelGridItem gridArea="settings">
        <PanelTitle title="Form Output" />
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
            Use the form above to preview the form output.
          </Typography>
        )}
      </PanelGridItem>

      <ErrorGridItem error={error} violations={violations} />
      <ConsoleGridItem logs={logs} />
    </PanelGrid>
  );
}
