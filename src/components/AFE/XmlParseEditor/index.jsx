import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import XmlParsePanel from './XmlParsePanel';
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

function XmlParseEditor(props) {
  const { editorId, classes } = props;
  const { data, result, error, violations } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const dispatch = useDispatch();
  const handleDataChange = () => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'xmlParser', {
        data: props.data,
        autoEvaluate: true,
        advanced: true,
        trimSpaces: false,
        rule: props.rule,
      })
    );
  }, [dispatch, editorId, props.data, props.rule]);

  useEffect(() => {
    handleInit();
  }, [handleInit]);

  return (
    <PanelGrid className={classes.template}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="XML Parse Options" />
        <XmlParsePanel editorId={editorId} />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <PanelTitle title="XML to Parse" />
        <CodePanel
          name="data"
          value={data}
          mode="xml"
          onChange={handleDataChange}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title="Parsed Result" />
        <CodePanel
          name="result"
          value={result ? result.data[0] : ''}
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

export default withStyles(styles)(XmlParseEditor);
