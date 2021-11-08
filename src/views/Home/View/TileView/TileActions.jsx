import React from 'react';
import EllipsisActionMenu from '../../../../components/EllipsisActionMenu';
import CopyIcon from '../../../../components/icons/CopyIcon';

const tileActions = [{
  Icon: CopyIcon,
  action: 'clone',
  label: 'Clone integration',
  // disabled: !validDashboardActions.includes('cancel'),
}];

// todo: siddharth
export default function TileActions() {
  const handleAction = () => {};

  return (
    <EllipsisActionMenu
      actionsMenu={tileActions}
      onAction={handleAction}
      alignment="vertical" />
  );
}
