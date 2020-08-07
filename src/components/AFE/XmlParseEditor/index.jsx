/* eslint-disable camelcase */
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
  const { editorId, disabled, rule = {}, editorDataTitle } = props;
  const classes = useStyles();
  const [editorInit, setEditorInit] = useState(false);
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

  useEffect(() => {
    // trigger data change when editor is initialized and sample data changes while uploading new file
    if (data !== undefined && props.data !== data) {
      handleDataChange(props.data);
    }
    // trigger this only when sample data changes. Dont add other dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'xmlParser', {
        data: props.data,
        // since we may be sharing the same editorId, we need to force
        // all default values.
        V0_json: rule?.V0_json === true || false,
        resourcePath: rule.resourcePath,
        trimSpaces: rule.trimSpaces,
        stripNewLineChars: rule.stripNewLineChars,
        attributePrefix: rule.attributePrefix,
        textNodeName: rule.textNodeName,
        listNodes: rule.listNodes,
        includeNodes: rule.includeNodes,
        excludeNodes: rule.excludeNodes,
      })
    );
  }, [dispatch, editorId, props.data, rule]);

  useEffect(() => {
    if (!editorInit) {
      handleInit();
      setEditorInit(true);
    }
  }, [editorInit, handleInit]);

  return (
    <PanelGrid key={editorId} className={classes.template} height="calc(100vh - 200px)">
      <PanelGridItem gridArea="rule">
        <PanelTitle title="XML parse options" />
        <XmlParsePanel disabled={disabled} editorId={editorId} />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <PanelTitle>
          <div>
            {editorDataTitle || (<Typography variant="body1">Sample XML file</Typography>)}
          </div>
        </PanelTitle>
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
