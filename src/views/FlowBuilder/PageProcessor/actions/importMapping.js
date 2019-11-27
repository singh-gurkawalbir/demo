import { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '../../../../components/icons/MapDataIcon';
import actions from '../../../../actions';
import helpTextMap from '../../../../components/Help/helpTextMap';
import mappingUtil from '../../../../utils/mapping';
import lookupUtil from '../../../../utils/lookup';
import MappingDialog from '../../../../components/AFE/ImportMapping/Dialog';

function ImportMappingDialog({ flowId, isViewMode, resource, onClose }) {
  const resourceId = resource._id;
  const dispatch = useDispatch();
  const handleSave = useCallback(
    ({ mappings, lookups, adaptorType }) => {
      if (mappings) {
        const patchSet = [];
        const mappingPath = mappingUtil.getMappingPath(adaptorType);

        // TODO: Below is cut and paste code. This should not have passed review.
        // this code bock is wrapped in a "if (mappings) {}" block, so both ternary operators
        // below are unnecessary (its always an add)

        // if mapping doesn't exist in resource object, perform add patch else replace patch
        patchSet.push({
          op: mappings ? 'replace' : 'add',
          path: mappingPath,
          value: mappings,
        });

        // update _lookup only if its being passed as param to function
        if (lookups) {
          const lookupPath = lookupUtil.getLookupPath(adaptorType);

          patchSet.push({
            op: lookups ? 'replace' : 'add',
            path: lookupPath,
            value: lookups,
          });
        }

        dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
        dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
      }
    },
    [dispatch, resourceId]
  );

  return (
    <Fragment>
      <MappingDialog
        id={`${resourceId}-${flowId}`}
        title="Define Import Mapping"
        disabled={isViewMode}
        flowId={flowId}
        resourceId={resourceId}
        onClose={onClose}
        onSave={handleSave}
      />
    </Fragment>
  );
}

function ImportMapping(props) {
  const { open } = props;

  return <Fragment>{open && <ImportMappingDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'importMapping',
  position: 'middle',
  Icon,
  // TODO: This helpText prop can easily be derived in the parent code using the
  // name prop. No need to add complexity to the metadata as refactoring will be
  // harder. what id we want to change the root path of all fb help text? We now need
  // to modify every action.
  helpText: helpTextMap['fb.pp.imports.importMapping'],
  Component: ImportMapping,
};
