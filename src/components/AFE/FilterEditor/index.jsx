import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { deepClone } from 'fast-json-patch';
import CodePanel from '../GenericEditor/CodePanel';
import FilterPanel from './FilterPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import ErrorGridItem from '../ErrorGridItem';
import layouts from '../layout/defaultDialogLayout';
import { isJsonString } from '../../../utils/string';
import Spinner from '../../Spinner';

const useStyles = makeStyles({
  ...layouts,
  columnTemplate: {
    gridTemplateColumns: '2fr 3fr 2fr',
    gridTemplateRows: '1fr 0fr',
    gridTemplateAreas: '"data rule result" "error error error"',
  },
});

export default function FilterEditor(props) {
  const { editorId, disabled, layout = 'column', optionalSaveParams, isToggleScreen } = props;
  const classes = useStyles(props);
  const { data, rule, lastValidData, result, error, isSampleDataLoading, processor } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const dispatch = useDispatch();
  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'filter', {
        data: props.data,
        lastValidData: props.data,
        rule: props.rule,
        _init_rule: deepClone(props.rule),
        optionalSaveParams,
        isSampleDataLoading: props.isSampleDataLoading,
      })
    );
  }, [dispatch, editorId, optionalSaveParams, props.data, props.rule, props.isSampleDataLoading]);
  const handleDataChange = useCallback(
    data => {
      const patchObj = { data };

      if (isJsonString(data)) {
        patchObj.lastValidData = data;
      }

      dispatch(actions.editor.patch(editorId, patchObj));
    },
    [dispatch, editorId]
  );

  useEffect(() => {
    // if the editor is being used in the toggle AFE, editor init should happen only once
    // TODO: we can remove isToggleScreen flag and implement this logic for all cases instead
    if (isToggleScreen && processor) return;
    handleInit();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToggleScreen, handleInit]);

  useEffect(() => {
    if (isSampleDataLoading && !props.isSampleDataLoading) {
      dispatch(actions.editor.patch(editorId, {
        isSampleDataLoading: false,
        data: props.data,
        lastValidData: props.data,
      }));
    }
  }, [dispatch, editorId, isSampleDataLoading, props.data, props.isSampleDataLoading]);

  let outputMessage = '';

  if (result && result.data) {
    if (result.data.length > 0) {
      outputMessage = 'TRUE: record will be processed';
    } else {
      outputMessage = 'FALSE: record will be ignored/discarded';
    }
  }

  return (
    <PanelGrid className={classes[`${layout}Template`]}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="Rules" />
        <FilterPanel
          key={editorId}
          editorId={editorId}
          data={lastValidData || data}
          rule={rule || props.rule}
          disabled={disabled}
        />
      </PanelGridItem>

      <PanelGridItem gridArea="data">
        <PanelTitle title="Input" />
        {isSampleDataLoading ? (
          <Spinner centerAll />
        ) : (
          <CodePanel
            name="data"
            readOnly={disabled}
            value={data}
            mode="json"
            onChange={handleDataChange}
            hasError={!!violations?.dataError}
        />
        )}
      </PanelGridItem>

      <PanelGridItem gridArea="result">
        <PanelTitle title="Output" />
        <CodePanel
          name="result"
          value={outputMessage}
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
