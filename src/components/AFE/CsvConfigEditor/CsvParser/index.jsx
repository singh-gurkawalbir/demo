import React, { useEffect, useCallback, useState } from 'react';
import { deepClone } from 'fast-json-patch';
import { useSelector, useDispatch } from 'react-redux';
import { string, object } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CodePanel from '../../GenericEditor/CodePanel';
import PanelGrid from '../../PanelGrid';
import PanelTitle from '../../PanelTitle';
import PanelGridItem from '../../PanelGridItem';
import ErrorGridItem from '../../ErrorGridItem';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import CsvParsePanel from './Panel';
import jsonUtil from '../../../../utils/json';
import csvOptions from '../options';

const useStyles = makeStyles({
  template: {
    gridTemplateColumns: '1fr 2fr',
    gridTemplateRows: '1fr 2fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
});

export default function CsvParseEditor(props) {
  const { editorId, disabled } = props;
  const classes = useStyles();
  const [editorInit, setEditorInit] = useState(false);
  const { data, result, error } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const dispatch = useDispatch();
  const handleInit = useCallback(() => {
    const { rule = {} } = props;

    rule.multipleRowsPerRecord = !!(
      props.rule &&
      props.rule.keyColumns &&
      props.rule.keyColumns.length
    );

    // replacing column Delimiter with column delimiter map key. Ex: ',' replaced with 'comma'
    if (rule.columnDelimiter) {
      const columnDelimiter = jsonUtil.getObjectKeyFromValue(
        csvOptions.ColumnDelimiterMap,
        rule.columnDelimiter
      );

      rule.columnDelimiter = columnDelimiter;
    }

    // replacing row Delimiter with row delimiter map key. Ex: '\n' replaced with 'lf'
    if (rule.rowDelimiter) {
      const rowDelimiter = jsonUtil.getObjectKeyFromValue(
        csvOptions.RowDelimiterMap,
        rule.rowDelimiter
      );

      rule.rowDelimiter = rowDelimiter;
    }

    const options = {
      data: props.data,
      autoEvaluate: true,
      ...rule,
      initRule: deepClone(rule),
    };

    dispatch(actions.editor.init(editorId, 'csvParser', options));
  }, [dispatch, editorId, props]);
  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  useEffect(() => {
    if (!editorInit) {
      handleInit();
      setEditorInit(true);
    }
  }, [editorInit, handleInit]);

  return (
    <PanelGrid className={classes.template}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="CSV parse options" />
        <CsvParsePanel disabled={disabled} editorId={editorId} />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <PanelTitle title="CSV to parse" />
        <CodePanel
          name="data"
          value={data}
          mode="text"
          onChange={handleDataChange}
          readOnly={disabled}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title="Parsed result" />
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
  rule: object,
  data: string,
};
