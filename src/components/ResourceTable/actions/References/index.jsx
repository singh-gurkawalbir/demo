import { Fragment, useState } from 'react';
import { IconButton } from '@material-ui/core';
import Icon from '../../../icons/ViewReferencesIcon';
import ResourceReferences from '../../../ResourceReferences';

// TODO: In case of monitor user, refernces shouldn't call accesstokens
export default {
  label: 'Used by',
  component: function References({ resourceType, resource }) {
    const [show, setShow] = useState(false);

    return (
      <Fragment>
        {show && (
          <ResourceReferences
            resourceType={resourceType}
            resourceId={resource._id}
            onClose={() => setShow(false)}
          />
        )}
        <IconButton
          data-test="showReferences"
          size="small"
          onClick={() => setShow(true)}>
          <Icon />
        </IconButton>
      </Fragment>
    );
  },
};
