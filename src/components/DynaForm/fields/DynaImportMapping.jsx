import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ImportMapping from '../../AFE/ImportMapping';
import mappingUtil from '../../../utils/mapping';
import * as ResourceUtil from '../../../utils/resource';
import { selectors } from '../../../reducers';

/*
lookups and lookupId is passed in options
Passing isStandaloneMapping with options will render Mapping as standalone component where user is able to save the mappings directly to server
*/
export default function DynaImportMapping(props) {
  const {
    id,
    onFieldChange,
    options,
    label,
    value,
    connectionId,
    resourceId,
    disabled,
  } = props;
  const {
    lookupId,
    lookups,
    isStandaloneMapping,
    sObjectType,
    recordType,
  } = options;
  const [isModalVisible, setModalVisibility] = useState(false);
  const toggleModalVisibility = () => {
    setModalVisibility(!isModalVisible);
  };

  const opts = {};
  const resourceData = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const { type: application } = ResourceUtil.getResourceSubType(resourceData);

  if (application === ResourceUtil.adaptorTypeMap.SalesforceImport) {
    opts.connectionId = connectionId;
    opts.sObjectType = sObjectType;
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
    mappings = mappingUtil.getMappingsForApp({
      mappings: value === '' ? {} : value,
      resource: resourceData,
    });
  }

  return (
    <>
      {isModalVisible && (
        <ImportMapping
          title="Define import mapping"
          id={id}
          connectionId={connectionId}
          application={application}
          resourceId={resourceId}
          lookups={lookups}
          isStandaloneMapping={isStandaloneMapping}
          mappings={mappings}
          extractFields={[]}
          onCancel={handleClose}
          onSave={handleSave}
          options={opts}
          disabled={disabled}
        />
      )}
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={toggleModalVisibility}>
        {label}
      </Button>
    </>
  );
}
