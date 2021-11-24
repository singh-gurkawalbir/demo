import React, { useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import AttachIcon from '../../../../icons/ConnectionsIcon';
import AttachFlowsDialog from '../../../../AttachFlows';

export default {
  key: 'attachFlow',
  useLabel: () => 'Attach flows',
  icon: AttachIcon,
  Component: ({rowData}) => {
    const match = useRouteMatch();
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
            flowGroupingId={match?.params?.sectionId}
          />
        )}
      </>
    );
  },
};
