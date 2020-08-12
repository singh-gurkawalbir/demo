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
import { selectors } from '../../../../reducers';
import CsvGeneratePanel from './Panel';
import PanelLoader from '../../../PanelLoader';

const useStyles = makeStyles({
  template: {
    gridTemplateColumns: '1fr 2fr',
    gridTemplateRows: '1fr 2fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
    height: 'calc(100vh - 200px)',
  },
});

export default function CsvGenerateEditor(props) {
  const { editorId, disabled } = props;
  const classes = useStyles();
  const [editorInit, setEditorInit] = useState(false);
  const { data, isSampleDataLoading, result, error } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const dispatch = useDispatch();
  const handleInit = useCallback(() => {
    const options = {
      data: props.data,
      rule: props.rule,
      isSampleDataLoading: !!(props.isSampleDataLoading),
      autoEvaluate: true,
    };

    dispatch(actions.editor.init(editorId, 'csvDataGenerator', options));
  }, [dispatch, editorId, props]);

  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  useEffect(() => {
    if (!editorInit) {
      handleInit();
      setEditorInit(true);
    }
  }, [data, editorInit, handleInit]);
  useEffect(() => {
    if (editorInit && props.isSampleDataLoading !== isSampleDataLoading) {
      dispatch(
        actions.editor.patch(editorId, {
          isSampleDataLoading: props.isSampleDataLoading,
        })
      );
    }
  }, [dispatch, editorId, editorInit, isSampleDataLoading, props.isSampleDataLoading]);
  useEffect(() => {
    if (editorInit && props.data !== data) {
      dispatch(
        actions.editor.patch(editorId, {
          data: props.data,
        })
      );
    }
  }, [data, dispatch, editorId, editorInit, props.data]);

  return (
    <PanelGrid className={classes.template} >
      <PanelGridItem gridArea="rule">
        <PanelTitle title="CSV generator options" />
        <CsvGeneratePanel disabled={disabled} editorId={editorId} />
      </PanelGridItem>
      <PanelGridItem gridArea="data" key={isSampleDataLoading}>
        <PanelTitle title="Sample flow data" />
        {/* show spinner instead of data panel when sample data is loading */}
        {isSampleDataLoading ? (
          <PanelLoader />
        ) : (
          <CodePanel
            name="data"
            value={data}
            mode="json"
            onChange={handleDataChange}
            readOnly={disabled}
        />
        )}
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title="Generated CSV file" />
        <CodePanel
          name="result"
          value={result && result.data ? result.data : ''}
          mode="text"
          readOnly
        />
      </PanelGridItem>

      {/* Hide error panel when sample data is loading */}
      {!isSampleDataLoading && (
        <ErrorGridItem error={error} violations={violations} />
      )}
    </PanelGrid>
  );
}

CsvGenerateEditor.propTypes = {
  rule: object,
  data: string,
};
