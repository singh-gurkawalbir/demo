import React from 'react';
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

    return (
      <AttachFlowsDialog
        integrationId={resourceId}
        flowGroupingId={match?.params?.sectionId}
      />
    );
  },
};
