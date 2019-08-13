import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core';
import actions from '../../../actions';
import CodePanel from '../GenericEditor/CodePanel';
import JavaScriptPanel from './JavaScriptPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import * as selectors from '../../../reducers';

const styles = {
  template: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
};

function JavaScriptEditor(props) {
  const { editorId, classes } = props;
  const { data, result, error, violations } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const dispatch = useDispatch();
  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'javascript', {
        scriptId: props.scriptId,
        entryFunction: props.entryFunction || 'main',
        data: props.data,
        autoEvaluate: true,
      })
    );
  }, [dispatch, editorId, props.data, props.entryFunction, props.scriptId]);

  useEffect(() => {
    handleInit();
  }, [handleInit]);
  const parsedData = result ? result.data : '';

  return (
    <PanelGrid className={classes.template}>
      <PanelGridItem gridArea="rule">
        <JavaScriptPanel editorId={editorId} />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <PanelTitle title="Function Input" />
        <CodePanel
          name="data"
          value={data}
          mode="json"
          onChange={handleDataChange}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title="Function Output" />
        <CodePanel name="result" value={parsedData} mode="json" readOnly />
      </PanelGridItem>

      <ErrorGridItem error={error} violations={violations} />
    </PanelGrid>
  );
}

export default withStyles(styles)(JavaScriptEditor);
