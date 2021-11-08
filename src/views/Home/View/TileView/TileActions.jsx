import React from 'react';
import EllipsisActionMenu from '../../../../components/EllipsisActionMenu';
import useTileActions from '../../../../hooks/useTileActions';

// todo: siddharth
export default function TileActions({tile}) {
  const {tileActions, handleAction} = useTileActions(tile);

  console.log('tileActions', tileActions);

  return (
    <EllipsisActionMenu
      actionsMenu={tileActions}
      onAction={handleAction}
      alignment="vertical" />
  );
}
