import { Fragment, useState } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../icons/ViewReferencesIcon';
import ResourceReferences from '../../../ResourceReferences';

export default {
  label: 'Used by',
  component: function References({ resourceType, resource }) {
    const [show, setShow] = useState(false);

    return (
      <Fragment>
        {show && (
          <ResourceReferences
            type={resourceType}
            id={resource._id}
            onClose={() => setShow(false)}
          />
        )}
        <IconButton size="small" onClick={() => setShow(true)}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
