import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import ImportMapping from '../../../components/AFE/ImportMapping';

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
    resourceId,
  } = props;
  const { lookupId, lookups, isStandaloneMapping } = options;
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

  const handleClose = (shouldCommit, mappings, lookups) => {
    if (shouldCommit) {
      onFieldChange(id, { fields: mappings });

      if (lookups) {
        onFieldChange(lookupId, lookups);
      }
    }

    toggleModalVisibility();
  };

  return (
    <Fragment>
      {isModalVisible && (
        <ImportMapping
          title="Define Import Mapping"
          id={id}
          application={application}
          lookups={lookups}
          isStandaloneMapping={isStandaloneMapping}
          resourceId={resourceId}
          mappings={value}
          generateFields={generateFields || []}
          extractFields={extractFields || []}
          onClose={handleClose}
        />
      )}
      <Button
        variant="outlined"
        color="secondary"
        onClick={toggleModalVisibility}>
        {label}
      </Button>
    </Fragment>
  );
}
