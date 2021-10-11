import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useState } from 'react';
import ArrowPopper from '../../ArrowPopper';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';
import MultipleAction from './MultipleAction';
import TextButton from '../../Buttons/TextButton';

const useStyles = makeStyles(theme => ({
  actionsMenuPopper: {
    maxWidth: 250,
    top: `${theme.spacing(1)}px !important`,
  },
}));

export default function ActionMenu({ useRowActions, rowData, setSelectedComponent, isIntegrationPage}) {
  const classes = useStyles();
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
      {isIntegrationPage
        ? (
          <TextButton
            startIcon={<EllipsisIcon />}
            data-test="openActionsMenu"
            onClick={handleMenuClick}>
            More
          </TextButton>
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
        )}
      {open && (
      <ArrowPopper
        placement="bottom-end"
        restrictToParent={false}
        classes={{ popper: classes.actionsMenuPopper }}
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
