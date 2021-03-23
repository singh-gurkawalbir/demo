import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../../actions';
import CodePanel from '../GenericEditor/CodePanel';
import JavaScriptPanel from './JavaScriptPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import { selectors } from '../../../reducers';
import layouts from '../layout/defaultDialogLayout';
import ConsoleGridItem from '../ConsoleGridItem';
import Spinner from '../../Spinner';

const useStyles = makeStyles({
  ...layouts,
  // Overriding default columnTemplate to suite our layout
  // TODO: @Azhar If this is the default layout we are following across all editors Can we replace in default layouts?
  columnTemplate: {
    gridTemplateColumns: '2fr 3fr 2fr',
    gridTemplateRows: '1fr 0fr',
    gridTemplateAreas: '"data rule result" "error error error"',
  },
});

export default function JavaScriptEditor(props) {
  const {
    editorId,
    entryFunction,
    context,
    scriptId,
    insertStubKey,
    disabled,
    optionalSaveParams,
    layout = 'compact',
    resultMode = 'json',
    isToggleScreen,
  } = props;
  const classes = useStyles(props);
  const { data, result, error, errorLine, isSampleDataLoading, processor } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const dispatch = useDispatch();
  const handleDataChange = useCallback(
    data => {
      dispatch(actions.editor.patch(editorId, { data }));
    },
    [dispatch, editorId]
  );
  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'javascript', {
        scriptId,
        _init_scriptId: scriptId,
        fetchScriptContent: true,
        entryFunction: entryFunction || 'main',
        data: props.data,
        context,
        _init_data: props.data,
        autoEvaluateDelay: 500,
        _init_entryFunction: entryFunction || 'main',
        optionalSaveParams,
        isSampleDataLoading: props.isSampleDataLoading,
      })
    );
  }, [
    dispatch,
    editorId,
    scriptId,
    entryFunction,
    props.data,
    props.isSampleDataLoading,
    context,
    optionalSaveParams,
  ]);

  useEffect(() => {
    // if the editor is being used in the toggle AFE, editor init should happen only once
    if (isToggleScreen && processor) return;
    handleInit();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleInit, isToggleScreen]);

  useEffect(() => {
    if (isSampleDataLoading && !props.isSampleDataLoading) {
      dispatch(actions.editor.patch(editorId, {
        isSampleDataLoading: false,
        data: props.data,
        _init_data: props.data,
      }));
    }
  }, [dispatch, editorId, isSampleDataLoading, props.data, props.isSampleDataLoading]);

  const parsedData = result ? result.data : '';
  const logs = result && !error && !violations && result.logs;

  return (
    <PanelGrid key={editorId} className={classes[`${layout}Template`]}>
      <PanelGridItem gridArea="rule">
        <JavaScriptPanel
          disabled={disabled}
          editorId={editorId}
          insertStubKey={insertStubKey}
          errorLine={errorLine}
          hasError={!!error}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <PanelTitle title="Function input" />
        {isSampleDataLoading ? (
          <Spinner centerAll />
        ) : (
          <CodePanel
            id="data"
            name="data"
            value={data}
            mode="json"
            readOnly={disabled}
            onChange={handleDataChange}
            hasError={!!violations?.dataError}
        />
        )}
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title="Function output" />
        <CodePanel
          id="result"
          name="result"
          value={parsedData}
          mode={resultMode}
          readOnly
        />
      </PanelGridItem>

      {/* Hide error panel when sample data is loading */}
      {!isSampleDataLoading && (
        <ErrorGridItem error={error} violations={violations} />
      )}
      <ConsoleGridItem logs={logs} />
    </PanelGrid>
  );
}
