import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { string, object } from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CodePanel from '../../GenericEditor/CodePanel';
import PanelGrid from '../../PanelGrid';
import PanelTitle from '../../PanelTitle';
import PanelGridItem from '../../PanelGridItem';
import ErrorGridItem from '../../ErrorGridItem';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import CsvParsePanel from './Panel';

const useStyles = makeStyles({
  template: {
    gridTemplateColumns: '1fr 2fr',
    gridTemplateRows: '1fr 2fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
});

export default function CsvParseEditor(props) {
  const { editorId, disabled, editorDataTitle } = props;
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
    const options = {
      data: props.data || '',
      rule: props.rule,
      autoEvaluate: true,
    };

    dispatch(actions.editor.init(editorId, 'csvParser', options));
  }, [dispatch, editorId, props]);
  const handleDataChange = useCallback(
    data => {
      dispatch(actions.editor.patch(editorId, { data }));
    },
    [dispatch, editorId]
  );

  useEffect(() => {
    if (!editorInit) {
      handleInit();
      setEditorInit(true);
    }
  }, [editorInit, handleInit]);

  useEffect(() => {
    // trigger data change when editor is initialized and sample data changes while uploading new file
    if (data !== undefined && props.data !== data) {
      handleDataChange(props.data);
    }
    // trigger this only when sample data changes. Dont add other dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  return (
    <PanelGrid className={classes.template} height="calc(100vh - 200px)">
      <PanelGridItem gridArea="rule">
        <PanelTitle title="CSV parser options" />
        <CsvParsePanel disabled={disabled} editorId={editorId} />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <PanelTitle>
          <div>
            {editorDataTitle || (<Typography variant="body1">Sample CSV file</Typography>)}
          </div>
        </PanelTitle>
        <CodePanel
          name="data"
          value={data}
          mode="text"
          onChange={handleDataChange}
          readOnly={disabled}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title="Parsed output" />
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
