import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import TransformEditorDialog from '../../../../components/AFE/TransformEditor/Dialog';
import helpTextMap from '../../../../components/Help/helpTextMap';

function TransformationDialog({ flowId, resource, onClose, isViewMode }) {
  const dispatch = useDispatch();
  const exportId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId: exportId,
      resourceType: 'exports',
      stage: 'transform',
    })
  );
  const rules = useMemo(
    () => resource && resource.transform && resource.transform.rules,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleClose = useCallback(
    (shouldCommit, editorValues) => {
      if (shouldCommit) {
        const { rule } = editorValues;
        const path = '/transform';
        const value = {
          rules: rule ? [rule] : [[]],
          version: '1',
        };
        const patchSet = [{ op: 'replace', path, value }];

        // Save the resource
        dispatch(actions.resource.patchStaged(exportId, patchSet, 'value'));
        dispatch(actions.resource.commitStaged('exports', exportId, 'value'));
      }

      onClose();
    },
    [dispatch, onClose, exportId]
  );

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          exportId,
          'exports',
          'transform',
          true
        )
      );
    }
  }, [dispatch, flowId, exportId, sampleData]);

  return (
    <TransformEditorDialog
      title="Transform Mapping"
      id={exportId}
      disabled={isViewMode}
      data={sampleData}
      rule={rules && rules[0]}
      onClose={handleClose}
    />
  );
}

function Transformation(props) {
  if (!props.open) return null;

  return <TransformationDialog {...props} />;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportTransformation',
  position: 'right',
  Icon,
  helpText: helpTextMap['fb.pg.exports.transform'],
  Component: Transformation,
};
