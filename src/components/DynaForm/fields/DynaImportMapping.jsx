import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import ImportMapping from '../../../components/AFE/ImportMapping';

/*
lookups and lookupId is passed in options

*/
export default function DynaImportMapping(props) {
  const { id, onFieldChange, options, label, value } = props;
  const { application, lookupId, lookups } = options;
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
