import { IconButton, Tooltip } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { ArrowPopper } from '@celigo/fuse-ui';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';
import MultipleAction from './MultipleAction';
import TextButton from '../../Buttons/TextButton';

export default function ActionMenu({ useRowActions, rowData, setSelectedComponent, iconLabel, tooltip }) {
  const [anchorEl, setAnchorEl] = useState(null);
  // We are passing state to action items where each Action item would check if it has got permission.
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'row-actions' : undefined;
  const handleMenuClick = useCallback(
    event => {
      setAnchorEl(event.currentTarget);
      setSelectedComponent(null);
    },
    [setSelectedComponent]
  );
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const actions = useRowActions(rowData);

  if (!actions || !actions.length) return null;

  return (
    <>
      {iconLabel
        ? (
          <TextButton
            startIcon={<EllipsisIcon />}
            data-test="openActionsMenu"
            onClick={handleMenuClick}>
            {iconLabel}
          </TextButton>
        ) : (
          <ActionIconButton
            tooltip={tooltip}
            actionsPopoverId={actionsPopoverId}
            handleMenuClick={handleMenuClick}
          />
        )}
      {open && (
      <ArrowPopper
        placement="bottom-end"
        preventOverflow={false}
        variant="menu"
        offset={[0, 4]}
        open={open}
        anchorEl={anchorEl}
        id={actionsPopoverId}
        onClose={handleMenuClose}>
        {actions.map(meta => (
          <MultipleAction
            key={meta.key}
            setSelectedComponent={setSelectedComponent}
            handleMenuClose={handleMenuClose}
            meta={meta}
            rowData={rowData} />
        ))}
      </ArrowPopper>
      )}
    </>
  );
}

const ActionIconButton = ({ tooltip, actionsPopoverId, handleMenuClick }) => tooltip ? (
  <Tooltip title={tooltip}>
    <IconButton
      data-test="openActionsMenu"
      aria-label="more"
      aria-controls={actionsPopoverId}
      aria-haspopup="true"
      size="small"
      onClick={handleMenuClick}>
      <EllipsisIcon />
    </IconButton>
  </Tooltip>
) : (
  <IconButton
    data-test="openActionsMenu"
    aria-label="more"
    aria-controls={actionsPopoverId}
    aria-haspopup="true"
    size="small"
    onClick={handleMenuClick}>
    <EllipsisIcon />
  </IconButton>
);
