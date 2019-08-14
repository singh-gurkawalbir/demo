import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { string } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import CsvParsePanel from './CsvParsePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const styles = {
  template: {
    gridTemplateColumns: '1fr 2fr',
    gridTemplateRows: '1fr 2fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
};

function CsvParseEditor(props) {
  const { editorId, classes } = props;
  const { data, result, error, violations } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const dispatch = useDispatch();
  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'csvParser', {
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

  return (
    <PanelGrid className={classes.template}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="CSV Parse Options" />
        <CsvParsePanel editorId={editorId} />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <PanelTitle title="CSV to Parse" />
        <CodePanel
          name="data"
          value={data}
          mode="text"
          onChange={handleDataChange}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title="Parsed Result" />
        <CodePanel
          name="result"
          value={result && result.data ? result.data : ''}
          mode="json"
          readOnly
        />
      </PanelGridItem>

      <ErrorGridItem error={error} violations={violations} />
    </PanelGrid>
  );
}

CsvParseEditor.propTypes = {
  rule: string,
  data: string,
};

export default withStyles(styles)(CsvParseEditor);
