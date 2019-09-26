import { useState, Fragment } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../icons/MapDataIcon';
import StandaloneImportMapping from '../AFE/ImportMapping/StandaloneImportMapping';

export default {
  label: 'Field Mapping',
  component: function FieldMapping({ resourceId }) {
    const [showDialog, setShowDialog] = useState(false);
    const onFieldMappingClick = () => {
      setShowDialog(!showDialog);
    };

    const handleClose = () => {
      setShowDialog(false);
    };

    return (
      <Fragment>
        {showDialog && (
          <StandaloneImportMapping
            resourceId={resourceId}
            title="Field Mappings"
            onClose={handleClose}
          />
        )}
        <IconButton size="small" onClick={onFieldMappingClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
