import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import ImportMapping from '../../../components/AFE/ImportMapping';
import MappingUtil from '../../../utils/mapping';

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
  } = props;
  const { lookupId, lookups, isStandaloneMapping } = options;
  const [isModalVisible, setModalVisibility] = useState(false);
  /*
     Using dummy data for functionality demonstration. generate fields and
     extrct fields to be extracted later when flow builder is ready
     The best way to fetch extract and generate field is to be figured out later
     */
  const generateFields = MappingUtil.getSampleGenerateFields();
  const extractFields = [];
  const toggleModalVisibility = () => {
    setModalVisibility(!isModalVisible);
  };

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
