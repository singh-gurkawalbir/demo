import React, { useState, useCallback } from 'react';
import ViewReferencesIcon from '../../../icons/ViewReferencesIcon';
import ResourceReferences from '../../../ResourceReferences';

// TODO: In case of monitor user, refernces shouldn't call accesstokens
export default {
  label: 'References',
  icon: ViewReferencesIcon,
  component: function References({ resourceType, rowData = {} }) {
    const { _id: resourceId } = rowData;
    const [show, setShow] = useState(true);
    const handleReferencesClose = useCallback(() => {
      setShow(false);
    }, []);

    return (
      <>
        {show && (
          <ResourceReferences
            resourceType={resourceType}
            resourceId={resourceId}
            onClose={handleReferencesClose}
          />
        )}
      </>
    );
  },
};
