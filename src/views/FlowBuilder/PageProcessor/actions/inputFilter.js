import { useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/InputFilterIcon';
import InputFilterEditorDialog from '../../../../components/AFE/FilterEditor/Dialog';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../../constants/resource';

function InputFilterDialog({
  flowId,
  resource,
  resourceType,
  isViewMode,
  onClose,
}) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'inputFilter',
    })
  );
  const rules = useMemo(
    () =>
      resource &&
      (resourceType === 'imports'
        ? resource.filter && resource.filter.rules
        : resource.inputFilter && resource.inputFilter.rules),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;
      const path = resourceType === 'imports' ? '/filter' : '/inputFilter';
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
              ].toUpperCase()}_HAS_CONFIGURED_INCOMING_FILTER`
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
          'inputFilter'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  return (
    <InputFilterEditorDialog
      title="Define Input Filter"
      id={resourceId + flowId}
      disabled={isViewMode}
      data={sampleData}
      rule={rules}
      onClose={handleClose}
    />
  );
}

function InputFilter(props) {
  const { open } = props;

  return <Fragment>{open && <InputFilterDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'inputFilter',
  position: 'left',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: InputFilter,
};
