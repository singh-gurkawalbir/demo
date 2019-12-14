import React, { useEffect, useCallback, useState } from 'react';
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
import CsvGeneratePanel from './Panel';
import jsonUtil from '../../../../utils/json';
import csvOptions from '../options';

const useStyles = makeStyles({
  template: {
    gridTemplateColumns: '1fr 2fr',
    gridTemplateRows: '1fr 2fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
});

export default function CsvGenerateEditor(props) {
  const { editorId, disabled } = props;
  const classes = useStyles();
  const [editorInit, setEditorInit] = useState(false);
  const { data, result, error, initChangeIdentifier } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const dispatch = useDispatch();
  const handleInit = useCallback(() => {
    const options = {
      data: props.data,
      autoEvaluate: true,
      multipleRowsPerRecord: !!(
        props.rule &&
        props.rule.keyColumns &&
        props.rule.keyColumns.length
      ),
      ...props.rule,
    };

    // replacing column Delimiter with column delimiter map key. Ex: ',' replaced with 'comma'
    if (options.columnDelimiter) {
      const columnDelimiter = jsonUtil.getObjectKeyFromValue(
        csvOptions.ColumnDelimiterMap,
        options.columnDelimiter
      );

      options.columnDelimiter = columnDelimiter;
    }

    // replacing row Delimiter with row delimiter map key. Ex: '\n' replaced with 'lf'
    if (options.rowDelimiter) {
      const rowDelimiter = jsonUtil.getObjectKeyFromValue(
        csvOptions.RowDelimiterMap,
        options.rowDelimiter
      );

      options.rowDelimiter = rowDelimiter;
    }

    dispatch(actions.editor.init(editorId, 'csvDataGenerator', options));
  }, [dispatch, editorId, props.data, props.rule]);
  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  useEffect(() => {
    if (!editorInit) {
      handleInit();
      setEditorInit(true);
    }
  }, [data, editorInit, handleInit]);

  return (
    <PanelGrid className={classes.template} key={initChangeIdentifier}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="CSV Generate Options" />
        <CsvGeneratePanel disabled={disabled} editorId={editorId} />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <PanelTitle title="Flow data" />
        <CodePanel
          name="data"
          value={data}
          mode="json"
          onChange={handleDataChange}
          readOnly={disabled}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title="Generated Result" />
        <CodePanel
          name="result"
          value={result && result.data ? result.data : ''}
          mode="text"
          readOnly
        />
      </PanelGridItem>

      <ErrorGridItem error={error} violations={violations} />
    </PanelGrid>
  );
}

CsvGenerateEditor.propTypes = {
  rule: object,
  data: string,
};
