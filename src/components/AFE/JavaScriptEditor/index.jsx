import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../../actions';
import CodePanel from '../GenericEditor/CodePanel';
import JavaScriptPanel from './JavaScriptPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import * as selectors from '../../../reducers';

const useStyles = makeStyles({
  template: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
});

export default function JavaScriptEditor(props) {
  const { editorId, entryFunction, scriptId } = props;
  const classes = useStyles(props);
  const { data, result, error, violations, initChangeIdentifier } = useSelector(
    state => selectors.editor(state, editorId)
  );
  const dispatch = useDispatch();
  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  // TODO : props.data is causing a recursive call ..its because of a selector merging patches and creating
  // new instances ?
  // TODO: @Aditya Scripts is not loading when props.data gets refreshed
  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'javascript', {
        scriptId,
        entryFunction: entryFunction || 'main',
        data: props.data,
        autoEvaluate: true,
      })
    );
  }, [dispatch, editorId, scriptId, entryFunction, props.data]);

  useEffect(() => {
    handleInit();
  }, [handleInit]);
  const parsedData = result ? result.data : '';

  return (
    <PanelGrid className={classes.template}>
      <PanelGridItem gridArea="rule">
        <JavaScriptPanel
          key={`${editorId}-${initChangeIdentifier}`}
          editorId={editorId}
        />
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
