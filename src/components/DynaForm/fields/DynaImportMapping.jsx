import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import ImportMapping from '../../../components/AFE/ImportMapping';
import MappingUtil from '../../../utils/mapping';
import * as ResourceUtil from '../../../utils/resource';

/*
lookups and lookupId is passed in options
Passing isStandaloneMapping with options will render Mapping as standalone component where user is able to save the mappings directly to server
*/
export default function DynaImportMapping(props) {
  const {
    id,
    application,
    onFieldChange,
    options,
    label,
    value,
    connectionId,
    // TODO: recordType support in import definition
    // recordType
  } = props;
  const {
    lookupId,
    lookups,
    isStandaloneMapping,
    sObjectType,
    recordType,
  } = options;
  const [isModalVisible, setModalVisibility] = useState(false);
  // TODO: Change to real data
  const generateFields = [];
  const extractFields = [];
  const toggleModalVisibility = () => {
    setModalVisibility(!isModalVisible);
  };

  const opts = {};

  if (application === ResourceUtil.adaptorTypeMap.SalesforceImport) {
    // opts.api = '';
    opts.connectionId = connectionId;
    // TODO: Hardcoding it. Change it to sObjectType
    opts.sObjectType = sObjectType;
    // 'account'
  } else if (
    application === ResourceUtil.adaptorTypeMap.NetSuiteDistributedImport
  ) {
    opts.connectionId = connectionId;
    opts.recordType = recordType;
  }

  const handleClose = () => {
    toggleModalVisibility();
  };

  const handleSave = (mappings, lookups) => {
    onFieldChange(id, mappings);

    if (lookups) {
      onFieldChange(lookupId, lookups);
    }

    handleClose();
  };

  let mappings = {};

  if (isModalVisible) {
    mappings = MappingUtil.getMappingsForApp({
      mappings: value === '' ? {} : value,
      appType: application,
    });
  }

  return (
    <Fragment>
      {isModalVisible && (
        <ImportMapping
          title="Define Import Mapping"
          id={id}
          // recordType={recordType}
          connectionId={connectionId}
          application={application}
          lookups={lookups}
          isStandaloneMapping={isStandaloneMapping}
          mappings={mappings}
          generateFields={generateFields || []}
          extractFields={extractFields || []}
          onCancel={handleClose}
          onSave={handleSave}
          options={opts}
        />
      )}
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={toggleModalVisibility}>
        {label}
      </Button>
    </Fragment>
  );
}
