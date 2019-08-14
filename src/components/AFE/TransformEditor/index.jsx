import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import TransformPanel from './TransformPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import ErrorGridItem from '../ErrorGridItem';

const styles = {
  template: {
    gridTemplateColumns: '2fr 3fr 2fr',
    gridTemplateRows: '1fr 0fr',
    gridTemplateAreas: '"data rule result" "error error error"',
  },
};

function TransformEditor(props) {
  const { editorId, classes } = props;
  const { data, result, error, violations } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const dispatch = useDispatch();
  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'transform', {
        data: props.data,
        autoEvaluate: true,
        rule: props.rule,
      })
    );
  }, [dispatch, editorId, props.data, props.rule]);
  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  useEffect(() => {
    handleInit();
  }, [handleInit]);

  const parsedData = result && result.data && result.data[0];

  return (
    <PanelGrid className={classes.template}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="Transform Rules" />
        <TransformPanel editorId={editorId} />
      </PanelGridItem>

      <PanelGridItem gridArea="data">
        <PanelTitle title="Incoming Data" />
        <CodePanel
          name="data"
          value={data}
          mode="json"
          overrides={{ showGutter: false }}
          onChange={handleDataChange}
        />
      </PanelGridItem>

      <PanelGridItem gridArea="result">
        <PanelTitle title="Transformed Data" />
        <CodePanel
          name="result"
          overrides={{ showGutter: false }}
          value={parsedData || ''}
          mode="json"
          readOnly
        />
      </PanelGridItem>

      <ErrorGridItem
        error={error ? error.message : null}
        violations={violations}
      />
    </PanelGrid>
  );
}

export default withStyles(styles)(TransformEditor);
