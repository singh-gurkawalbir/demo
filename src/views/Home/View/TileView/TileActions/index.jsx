import React from 'react';
import EllipsisActionMenu from '../../../../../components/EllipsisActionMenu';
import useTileActions from './useTileActions';

export default function TileActions({tile}) {
  const {tileActions, handleAction} = useTileActions(tile);

  return (
    <EllipsisActionMenu
      actionsMenu={tileActions}
      onAction={handleAction}
      alignment="vertical" />
  );
}
