import { useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/InputFilterIcon';
import InputFilterEditorDialog from '../../../../components/AFE/FilterEditor/Dialog';

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
    selectors.getSampleData(state, flowId, resourceId, 'inputFilter', {
      isImport: resourceType === 'imports',
    })
  );
  const rules = useMemo(
    () =>
      resource &&
      resource.filter &&
      (resourceType === 'imports'
        ? resource.filter.rules
        : resource.inputFilter.rules),
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
