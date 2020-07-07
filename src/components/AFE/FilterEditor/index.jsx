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
import Spinner from '../../Spinner';

const useStyles = makeStyles({
  ...layouts,
  columnTemplate: {
    gridTemplateColumns: '2fr 3fr 2fr',
    gridTemplateRows: '1fr 0fr',
    gridTemplateAreas: '"data rule result" "error error error"',
  },
  spinnerWrapper: {
    display: 'flex',
    height: '100%',
    '&> div:first-child': {
      margin: 'auto',
    },
  },
});

export default function FilterEditor(props) {
  const { editorId, disabled, layout = 'column', optionalSaveParams } = props;
  const classes = useStyles(props);
  const { data, lastValidData, result, error, isSampleDataLoading } = useSelector(state =>
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
        optionalSaveParams,
        isSampleDataLoading: props.isSampleDataLoading
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
        {isSampleDataLoading ? (
          <div className={classes.spinnerWrapper}>
            <Spinner size={48} color="primary" />
          </div>
        ) : (
          <CodePanel
            name="data"
            readOnly={disabled}
            value={data}
            mode="json"
            overrides={{ showGutter: false }}
            onChange={handleDataChange}
        />)}
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
