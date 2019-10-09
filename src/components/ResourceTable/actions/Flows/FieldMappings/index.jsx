import { useState, Fragment } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../../icons/MapDataIcon';
import MappingDialog from '../../../../MappingDialog';

export default {
  label: 'Field Mapping',
  component: function FieldMapping({ resource }) {
    const [showFieldMapping, setSowFieldMapping] = useState(false);
    const onFieldMappingClick = () => {
      setSowFieldMapping(!showFieldMapping);
    };

    const handleClose = () => {
      setSowFieldMapping(false);
    };

    return (
      <Fragment>
        {showFieldMapping && (
          <MappingDialog
            resource={resource}
            title="Field Mappings"
            onClose={handleClose}
          />
        )}
        <IconButton
          data-test="showFieldMappingDialog"
          size="small"
          onClick={onFieldMappingClick}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
