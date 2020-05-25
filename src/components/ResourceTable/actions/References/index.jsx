import { Fragment, useState, useCallback } from 'react';
import ViewReferencesIcon from '../../../icons/ViewReferencesIcon';
import ResourceReferences from '../../../ResourceReferences';

// TODO: In case of monitor user, refernces shouldn't call accesstokens
export default {
  title: 'References',
  icon: ViewReferencesIcon,
  component: function References({ resourceType, resource }) {
    const [show, setShow] = useState(true);
    const handleReferencesClose = useCallback(() => {
      setShow(false);
    }, []);

    return (
      <Fragment>
        {show && (
          <ResourceReferences
            resourceType={resourceType}
            resourceId={resource._id}
            onClose={handleReferencesClose}
          />
        )}
      </Fragment>
    );
  },
};
