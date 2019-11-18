import { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popover, IconButton, Tooltip } from '@material-ui/core';
import EllipsisIcon from '../../icons/EllipsisVerticalIcon';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    position: 'sticky',
    display: 'flex',
    overflow: 'hidden',
    zIndex: 1,
  },
  action: {
    padding: theme.spacing(0, 0),
  },
  actionColHead: {
    // any smaller and table "jiggles" when transitioning to/from hover state
    width: 125,
    textAlign: 'center',
  },
  ellipsisContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function ActionMenu({ actions }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const actionContainerEl = useRef(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'more-row-actions' : undefined;

  if (!actions || !actions.length) return null;

  const renderAction = ({ label, component }, placement) => (
    <Tooltip key={label} title={label} placement={placement}>
      <span>{component}</span>
    </Tooltip>
  );
  const count = 3; // number of actions to display outside of menu

  if (actions.length <= count) {
    return (
      <div className={classes.actionContainer}>
        {actions.map(a => renderAction(a))}
      </div>
    );
  }

  return (
    <div ref={actionContainerEl} className={classes.actionContainer}>
      {actions.slice(0, count).map(a => renderAction(a))}

      <Tooltip title="More actions">
        <IconButton
          data-test="openActionsMenu"
          size="small"
          aria-describedby={id}
          onClick={handleClick}>
          <EllipsisIcon />
        </IconButton>
      </Tooltip>
      <Popover
        elevation={1}
        id={id}
        open={open}
        anchorEl={anchorEl}
        // buttons within buttons break DOM check. Need container to be parent div.
        container={actionContainerEl.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}>
        <div className={classes.ellipsisContainer}>
          {actions.slice(count).map(a => renderAction(a, 'left'))}
        </div>
      </Popover>
    </div>
  );
}
