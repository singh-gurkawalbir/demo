import { Fragment } from 'react';
import Icon from '../../../../components/icons/MapDataIcon';
import StandaloneImportMapping from '../../../../components/AFE/ImportMapping/StandaloneImportMapping';

function ImportMappingDialog({ resource, open, onClose }) {
  const resourceId = resource._id;
  const connectionId = resource._connectionId;

  return (
    <Fragment>
      {open && (
        <StandaloneImportMapping
          resourceId={resourceId}
          connectionId={connectionId}
          onClose={onClose}
        />
      )}
    </Fragment>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'importMapping',
  position: 'middle',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: ImportMappingDialog,
};
