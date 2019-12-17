import { useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import OutputFilterEditorDialog from '../../../../components/AFE/FilterEditor/Dialog';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../../constants/resource';

function OutputFilterDialog({
  flowId,
  resource,
  isViewMode,
  resourceType,
  onClose,
}) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'outputFilter',
    })
  );
  const rules = useMemo(
    () => resource && resource.filter && resource.filter.rules,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;
      const path = '/filter';
      const value = {
        rules: rule || [],
        version: '1',
      };
      const patchSet = [{ op: 'replace', path, value }];

      // Save the resource
      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resourceId, 'value')
      );

      if (!rules || rules.length === 0) {
        if (value.rules.length > 0) {
          dispatch(
            actions.analytics.gainsight.trackEvent(
              `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[
                resourceType
              ].toUpperCase()}_HAS_CONFIGURED_FILTER`
            )
          );
        }
      }
    }

    onClose();
  };

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'outputFilter'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  return (
    <OutputFilterEditorDialog
      title="Define Output Filter"
      id={resourceId + flowId}
      disabled={isViewMode}
      data={sampleData}
      rule={rules}
      onClose={handleClose}
    />
  );
}

function OutputFilter(props) {
  const { open } = props;

  return <Fragment>{open && <OutputFilterDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'outputFilter',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pp.exports.filter'],
  Component: OutputFilter,
};
