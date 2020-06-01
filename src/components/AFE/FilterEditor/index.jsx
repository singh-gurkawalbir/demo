import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import FilterPanel from './FilterPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import ErrorGridItem from '../ErrorGridItem';
import layouts from '../layout/defaultDialogLayout';
import { isJsonString } from '../../../utils/string';

const useStyles = makeStyles({
  ...layouts,
  columnTemplate: {
    gridTemplateColumns: '2fr 3fr 2fr',
    gridTemplateRows: '1fr 0fr',
    gridTemplateAreas: '"data rule result" "error error error"',
  },
});

export default function FilterEditor(props) {
  const { editorId, disabled, layout = 'column', optionalSaveParams } = props;
  const classes = useStyles(props);
  const { data, lastValidData, result, error } = useSelector(state =>
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
        rule: props.rule,
        optionalSaveParams,
      })
    );
  }, [dispatch, editorId, optionalSaveParams, props.data, props.rule]);
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
    handleInit();
  }, [handleInit]);

  let outputMessage = '';

  if (result && result.data) {
    if (result.data.length > 0) {
      outputMessage = 'TRUE: record will be processed';
    } else {
      outputMessage = 'FALSE: record will be ignored/discarded';
    }
  }

  console.log('lastValidData || data', lastValidData || data);

  return (
    <PanelGrid className={classes[`${layout}Template`]}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="Rules" />
        <FilterPanel
          key={editorId}
          editorId={editorId}
          data={lastValidData || data}
          rule={props.rule}
          disabled={disabled}
        />
      </PanelGridItem>

      <PanelGridItem gridArea="data">
        <PanelTitle title="Input" />
        <CodePanel
          name="data"
          readOnly={disabled}
          value={data}
          mode="json"
          overrides={{ showGutter: false }}
          onChange={handleDataChange}
        />
      </PanelGridItem>

      <PanelGridItem gridArea="result">
        <PanelTitle title="Output" />
        <CodePanel
          name="result"
          overrides={{ showGutter: false }}
          value={outputMessage}
          mode="text"
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
