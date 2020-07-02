/* eslint-disable camelcase */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import XmlParsePanel from './XmlParsePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const useStyles = makeStyles({
  template: {
    gridTemplateColumns: '1fr 2fr',
    gridTemplateRows: '1fr 2fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
});

export default function XmlParseEditor(props) {
  const { editorId, disabled } = props;
  const classes = useStyles();
  const { data, result, error } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const dispatch = useDispatch();
  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'xmlParser', {
        data: props.data,
        // since we may be sharing the same editorId, we need to force
        // all default values.
        V0_json: props.rule.V0_json === true || false,
        trimSpaces: props.rule.trimSpaces,
        stripNewLineChars: props.rule.stripNewLineChars,
        attributePrefix: props.rule.attributePrefix,
        textNodeName: props.rule.textNodeName,
        listNodes: props.rule.listNodes,
        includeNodes: props.rule.includeNodes,
        excludeNodes: props.rule.excludeNodes,
      })
    );
  }, [dispatch, editorId, props.data, props.rule]);

  useEffect(() => handleInit(), [handleInit]);

  return (
    <PanelGrid key={editorId} className={classes.template}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="XML parse options" />
        <XmlParsePanel disabled={disabled} editorId={editorId} />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <PanelTitle title="XML to parse" />
        <CodePanel
          name="data"
          value={data}
          mode="xml"
          onChange={handleDataChange}
          readOnly={disabled}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title="Parsed output" />
        <CodePanel
          name="result"
          value={result ? result.data[0] : ''}
          mode="json"
          readOnly
        />
      </PanelGridItem>

      <ErrorGridItem error={error} violations={violations} />
    </PanelGrid>
  );
}
