import { useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';
import ExportFilterToggleEditorDialog from '../../../../components/AFE/FilterEditor/FilterToggleEditorDialog';
import helpTextMap from '../../../../components/Help/helpTextMap';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function ExportFilterDialog({ flowId, resource, isViewMode, onClose }) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType: 'exports',
      stage: 'outputFilter',
    })
  );
  const { type, rules, scriptId, entryFunction } = useMemo(() => {
    const filterObj = (resource && resource.filter) || {};
    const { type, script = {}, expression = {} } = filterObj;

    return {
      type,
      rules: expression.rules || [],
      scriptId: script._scriptId,
      entryFunction: script.function,
    };
  }, [resource]);
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'exports',
          'outputFilter'
        )
      );
    }
  }, [dispatch, flowId, resourceId, sampleData]);

  const optionalSaveParams = useMemo(
    () => ({
      processorKey: 'exportFilter',
      resourceId,
      resourceType: 'exports',
      rules,
    }),
    [resourceId, rules]
  );

  return (
    <ExportFilterToggleEditorDialog
      title="Define output filter"
      disabled={isViewMode}
      id={resourceId}
      data={sampleData}
      type={type}
      rule={rules}
      scriptId={scriptId}
      entryFunction={entryFunction || hooksToFunctionNamesMap.filter}
      insertStubKey="filter"
      onClose={handleClose}
      optionalSaveParams={optionalSaveParams}
    />
  );
}

function FilterDialog(props) {
  const { open } = props;

  return <Fragment>{open && <ExportFilterDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportFilter',
  position: 'right',
  Icon,
  helpText: helpTextMap['fb.pg.exports.filter'],
  Component: FilterDialog,
};
