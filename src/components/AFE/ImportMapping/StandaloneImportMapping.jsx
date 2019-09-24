import { useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import MappingUtil from '../../../utils/mapping';
import * as ResourceUtil from '../../../utils/resource';
import { sanitizePreConstructedPatch } from '../../../forms/utils';
import LookupUtil from '../../../utils/lookup';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import ImportMapping from './';
import LoadResources from '../../../components/LoadResources';
import MappingIcon from '../../../components/icons/MapDataIcon';

/*
This component can be used to manage Import lookups
<StandaloneImportMapping
id="1"
resourceId="1234"
/>
*/

export default function StandaloneImportMapping(props) {
  const { id, resourceId } = props;
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisibility] = useState(false);
  /*
     Using dummy data for functionality demonstration. generate fields and
     extrct fields to be extracted later when flow builder is ready
     The best way to fetch extract and generate field is to be figured out later
     */
  const generateFields = ['myName', 'myId'];
  const extractFields = ['name', 'id'];
  const toggleModalVisibility = () => {
    setModalVisibility(!isModalVisible);
  };

  const resourceData = useSelector(state => {
    const data = selectors.resource(state, 'imports', resourceId);

    return data;
  });
  const resourceType = ResourceUtil.getResourceSubType(resourceData);
  const mappings = MappingUtil.getMappingFromResource(
    resourceData,
    resourceType.type
  );
  const lookups = LookupUtil.getLookupFromResource(
    resourceData,
    resourceType.type
  );
  const handleClose = (closeModal, mappings, lookups) => {
    if (mappings) {
      const patchSet = [
        {
          op: 'replace',
          path: MappingUtil.getMappingPath(resourceType.type),
          value: mappings,
        },
      ];

      if (lookups) {
        patchSet.push({
          op: 'replace',
          path: LookupUtil.getLookupPath(resourceType.type),
          value: lookups,
        });
      }

      const sanitizedPatchSet = sanitizePreConstructedPatch(
        patchSet,
        resourceData
      );

      dispatch(
        actions.resource.patchStaged(resourceId, sanitizedPatchSet, 'value')
      );
      dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
    }

    if (closeModal) toggleModalVisibility();
  };

  return (
    <Fragment>
      {isModalVisible && (
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
      )}
      <IconButton
        key="showMapping"
        aria-label="showMapping"
        color="inherit"
        onClick={toggleModalVisibility}>
        <MappingIcon />
      </IconButton>
    </Fragment>
  );
}
