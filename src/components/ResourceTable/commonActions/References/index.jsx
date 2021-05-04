import React, { useState, useCallback } from 'react';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import ViewReferencesIcon from '../../../icons/ViewReferencesIcon';
import ResourceReferences from '../../../ResourceReferences';

// TODO: In case of monitor user, refernces shouldn't call accesstokens
export default {
  useLabel: () => 'Used by',
  icon: ViewReferencesIcon,
  Component: ({rowData}) => {
    const { _id: resourceId } = rowData;
    const {resourceType} = useGetTableContext();
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
