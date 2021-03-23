import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import TransformPanel from './TransformPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import ErrorGridItem from '../ErrorGridItem';
import layouts from '../layout/defaultDialogLayout';
import Spinner from '../../Spinner';

const useStyles = makeStyles({
  ...layouts,
  // Overriding default columnTemplate to suite our layout
  // TODO: @Azhar If this is the default layout we are following across all editors Can we replace in default layouts?
  columnTemplate: {
    gridTemplateColumns: '2fr 3fr 2fr',
    gridTemplateRows: '1fr 0fr',
    gridTemplateAreas: '"data rule result" "error error error"',
  },
});

export default function TransformEditor(props) {
  const {
    editorId,
    disabled,
    optionalSaveParams,
    resourceId,
    layout = 'column',
    isToggleScreen,
  } = props;
  const classes = useStyles();
  const { data, result, error, isSampleDataLoading, processor } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const dispatch = useDispatch();
  const keyName = 'extract';
  const valueName = 'generate';
  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'transform', {
        data: props.data,
        rule: props.rule,
        resourceId,
        duplicateKeyToValidate: [valueName],
        _init_data: props.data,
        _init_rule: props.rule,
        optionalSaveParams,
        isSampleDataLoading: props.isSampleDataLoading,
      })
    );
  }, [
    dispatch,
    editorId,
    optionalSaveParams,
    props.data,
    props.rule,
    props.isSampleDataLoading,
    resourceId,
  ]);
  const handleDataChange = useCallback(
    data => {
      dispatch(actions.editor.patch(editorId, { data }));
    },
    [dispatch, editorId]
  );

  useEffect(() => {
    // if the editor is being used in the toggle AFE, editor init should happen only once
    if (isToggleScreen && processor) return;
    handleInit();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToggleScreen, handleInit]);
  useEffect(() => {
    if (isSampleDataLoading && !props.isSampleDataLoading) {
      dispatch(actions.editor.patch(editorId, {
        isSampleDataLoading: false,
        data: props.data,
        _init_data: props.data,
      }));
    }
  }, [data, dispatch, editorId, isSampleDataLoading, props.data, props.isSampleDataLoading]);

  const parsedData = result && result.data && result.data[0];

  return (
    <PanelGrid key={editorId} className={classes[`${layout}Template`]}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title="Rules" />
        <TransformPanel
          keyName={keyName}
          valueName={valueName}
          editorId={editorId}
          disabled={disabled}
          hasError={!!error}
        />
      </PanelGridItem>

      <PanelGridItem gridArea="data">
        <PanelTitle title="Input" />
        {isSampleDataLoading ? (
          <Spinner />
        ) : (
          <CodePanel
            name="data"
            value={data}
            mode="json"
            onChange={handleDataChange}
            readOnly={disabled}
            hasError={!!violations?.dataError}
            />
        )}
      </PanelGridItem>

      <PanelGridItem gridArea="result">
        <PanelTitle title="Output" />
        <CodePanel
          name="result"
          value={parsedData || ''}
          mode="json"
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
