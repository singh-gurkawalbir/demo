import { useDispatch, useSelector } from 'react-redux';
import MappingUtil from '../../../utils/mapping';
import * as ResourceUtil from '../../../utils/resource';
import LookupUtil from '../../../utils/lookup';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import ImportMapping from './';
import LoadResources from '../../../components/LoadResources';

/**
 *
 *(This component can be used to manage Import lookups)
 * @export
 * @param {string} id (unique Id)
 * @param {string} resourceId (Import Resource Id)
 * @param {function} onClose (callback for closing the mapping dialog)
 */

export default function StandaloneImportMapping(props) {
  const { id, resourceId, onClose, connectionId } = props;
  const dispatch = useDispatch();
  /*
     Using dummy data for functionality demonstration. generate fields and
     extrct fields to be extracted later when flow builder is ready
     replace getSampleGenerateFields by fetching sample data
  */
  const generateFields = MappingUtil.getSFSampleGenerateFields();
  // MappingUtil.getSampleGenerateFields();
  const extractFields = [];
  const resourceData = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const options = {};
  const resourceType = ResourceUtil.getResourceSubType(resourceData);

  if (resourceType.type === ResourceUtil.adaptorTypeMap.SalesforceImport) {
    options.api = resourceData.salesforce.api;
    options.connectionId = connectionId;
    options.sObjectType = resourceData.salesforce.sObjectType;
  }

  if (resourceType.type === ResourceUtil.adaptorTypeMap.NetSuiteImport) {
    options.recordType =
      resourceData.netsuite_da && resourceData.netsuite_da.recordType;
    options.connectionId = connectionId;
  }

  const mappings = MappingUtil.getMappingFromResource(
    resourceData,
    resourceType.type
  );
  // const recordType = MappingUtil.getRecordTypeFromResource(
  //   resourceData,
  //   resourceType.type
  // );
  // check for case when there is no lookups and we saving without lookups
  const lookups = LookupUtil.getLookupFromResource(
    resourceData,
    resourceType.type
  );
  const handleSave = (_mappings, _lookups, closeModal) => {
    // perform save operation only when mapping object is passed as parameter to the function.
    if (_mappings) {
      const patchSet = [];
      const mappingPath = MappingUtil.getMappingPath(resourceType.type);

      // if mapping doesnt exist in resouce object , perform add patch else replace patch
      patchSet.push({
        op: mappings ? 'replace' : 'add',
        path: mappingPath,
        value: _mappings,
      });

      // update _lookup only if its being passed as param to function
      if (_lookups) {
        const lookupPath = LookupUtil.getLookupPath(resourceType.type);

        patchSet.push({
          op: lookups ? 'replace' : 'add',
          path: lookupPath,
          value: _lookups,
        });
      }

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
    }

    if (closeModal) onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <LoadResources resources="imports">
      <ImportMapping
        title="Define Import Mapping"
        id={id}
        // recordType={recordType}
        // connectionId={connectionId}
        application={resourceType.type}
        lookups={lookups}
        isStandaloneMapping
        resourceId={resourceId}
        mappings={mappings}
        showDialogClose
        generateFields={generateFields}
        extractFields={extractFields}
        onCancel={handleCancel}
        onSave={handleSave}
        options={options}
      />
    </LoadResources>
  );
}
