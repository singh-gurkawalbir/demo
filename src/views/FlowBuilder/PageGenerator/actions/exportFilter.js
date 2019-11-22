import { useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';
import ExportFilterEditorDialog from '../../../../components/AFE/FilterEditor/Dialog';
import helpTextMap from '../../../../components/Help/helpTextMap';

function ExportFilterDialog({ flowId, resource, isViewMode, onClose }) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'outputFilter', {
      isPageGenerator: true,
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
      dispatch(actions.resource.commitStaged('exports', resourceId, 'value'));
    }

    onClose();
  };

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'exports',
          'outputFilter',
          true
        )
      );
    }
  }, [dispatch, flowId, resourceId, sampleData]);

  return (
    <ExportFilterEditorDialog
      title="Define Output Filter"
      disabled={isViewMode}
      id={resourceId}
      data={sampleData}
      rule={rules}
      onClose={handleClose}
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
