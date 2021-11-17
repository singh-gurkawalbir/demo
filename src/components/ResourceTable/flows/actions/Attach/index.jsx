import React, { useState, useCallback } from 'react';
import AttachIcon from '../../../../icons/ConnectionsIcon';
import AttachFlowsDialog from '../../../../AttachFlows';

export default {
  key: 'attachFlow',
  useLabel: () => 'Attach flow',
  icon: AttachIcon,
  Component: ({rowData}) => {
    const { _id: resourceId } = rowData;
    const [showDialog, setShowDialog] = useState(true);
    const toggleDialog = useCallback(() => {
      setShowDialog(!showDialog);
    }, [showDialog]);

    return (
      <>
        {showDialog && (
          <AttachFlowsDialog
            integrationId={resourceId}
            onClose={toggleDialog}
          />
        )}
      </>
    );
  },
};
