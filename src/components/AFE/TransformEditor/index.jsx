import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import TransformPanel from './TransformPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import ErrorGridItem from '../ErrorGridItem';

const useStyles = makeStyles({
  template: {
    gridTemplateColumns: '2fr 3fr 2fr',
    gridTemplateRows: '1fr 0fr',
    gridTemplateAreas: '"data rule result" "error error error"',
  },
});

export default function TransformEditor(props) {
  const { editorId, disabled } = props;
  const classes = useStyles();
  const { data, result, error, initChangeIdentifier } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const dispatch = useDispatch();
  const keyName = 'extract';
  const valueName = 'generate';
  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'transform', {
        data: props.data,
        autoEvaluate: true,
        rule: props.rule,
        duplicateKeyToValidate: [valueName],
      })
    );
  }, [dispatch, editorId, props.data, props.rule]);
  const handleDataChange = useCallback(
    data => {
      dispatch(actions.editor.patch(editorId, { data }));
    },
    [dispatch, editorId]
  );

  useEffect(() => {
    handleInit();
  }, [handleInit]);

  const parsedData = result && result.data && result.data[0];

  return (
    <PanelGrid
      key={`${editorId}-${initChangeIdentifier}`}
      className={classes.template}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="Transform Rules" />
        <TransformPanel
          keyName={keyName}
          valueName={valueName}
          editorId={editorId}
          disabled={disabled}
        />
      </PanelGridItem>

      <PanelGridItem gridArea="data">
        <PanelTitle title="Incoming Data" />
        <CodePanel
          name="data"
          value={data}
          mode="json"
          overrides={{ showGutter: false }}
          onChange={handleDataChange}
          readOnly={disabled}
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
