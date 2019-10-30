import { useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';
import ExportFilterEditorDialog from '../../../../components/AFE/QueryBuilder/Dialog';

function ExportFilterDialog({ flowId, resource, onClose }) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'outputFilter', {
      isPageGenerator: true,
    })
  );

  console.log(`sampleData in Filters ${JSON.stringify(sampleData)}`);
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
        rules: rule ? [rule] : [[]],
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
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: FilterDialog,
};
