import { useDispatch, useSelector } from 'react-redux';
import MappingUtil from '../../../utils/mapping';
import * as ResourceUtil from '../../../utils/resource';
// import { sanitizePreConstructedPatch } from '../../../forms/utils';
import LookupUtil from '../../../utils/lookup';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import ImportMapping from './';
import LoadResources from '../../../components/LoadResources';

/*
This component can be used to manage Import lookups
<StandaloneImportMapping
id="1"
resourceId="1234"
/>
*/

export default function StandaloneImportMapping(props) {
  const { id, resourceId, onClose } = props;
  const dispatch = useDispatch();
  /*
     Using dummy data for functionality demonstration. generate fields and
     extrct fields to be extracted later when flow builder is ready
     The best way to fetch extract and generate field is to be figured out later
     */
  const generateFields = ['myName', 'myId'];
  const extractFields = ['name', 'id'];
  const resourceData = useSelector(state => {
    const data = selectors.resource(state, 'imports', resourceId);

    return data;
  });
  const resourceType = ResourceUtil.getResourceSubType(resourceData);
  const mappings = MappingUtil.getMappingFromResource(
    resourceData,
    resourceType.type
  );
  // check for case when there is no lookups and we saving without lookups
  const lookups = LookupUtil.getLookupFromResource(
    resourceData,
    resourceType.type
  );
  const handleClose = (closeModal, mappings, lookupsTmp) => {
    if (mappings) {
      const patchSet = [
        {
          op: 'update',
          path: MappingUtil.getMappingPath(resourceType.type),
          value: mappings,
        },
      ];

      if (lookupsTmp.length) {
        patchSet.push({
          op: 'update',
          path: LookupUtil.getLookupPath(resourceType.type),
          value: lookupsTmp,
        });
      }

      // const sanitizedPatchSet = sanitizePreConstructedPatch({
      //   patchSet,
      //   resource: resourceData,
      // });
      const sanitizedPatchSet = patchSet;

      dispatch(
        actions.resource.patchStaged(resourceId, sanitizedPatchSet, 'value')
      );
      dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
    }

    if (closeModal) onClose();
  };

  return (
    <LoadResources resources="imports">
      <ImportMapping
        title="Define Import Mapping"
        id={id}
        application={resourceType.type}
        lookups={lookups || []}
        isStandaloneMapping
        resourceId={resourceId}
        mappings={mappings || {}}
        generateFields={generateFields || []}
        extractFields={extractFields || []}
        onClose={handleClose}
      />
    </LoadResources>
  );
}
