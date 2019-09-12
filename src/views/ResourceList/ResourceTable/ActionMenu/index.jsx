import { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popover, IconButton, Tooltip } from '@material-ui/core';
import EllipsisIcon from '../../../../components/icons/EllipsisVerticalIcon';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    position: 'sticky',
    display: 'flex',
    overflow: 'hidden',
  },
  action: {
    padding: theme.spacing(0, 0),
  },
  actionColHead: {
    // any smaller and table "giggles" when transitioning to/from hover state
    width: 115,
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
  const id = open ? 'simple-popover' : undefined;

  if (!actions || !actions.length) return null;

  if (actions.length < 4) {
    return (
      <div className={classes.actionContainer}>
        {actions.map(({ label, component }) => (
          <Tooltip key={label} title={label}>
            <span>{component}</span>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <div ref={actionContainerEl} className={classes.actionContainer}>
      <Tooltip title={actions[0].label}>
        <span>{actions[0].component}</span>
      </Tooltip>
      <Tooltip title={actions[1].label}>
        <span>{actions[1].component}</span>
      </Tooltip>

      <IconButton size="small" aria-describedby={id} onClick={handleClick}>
        <EllipsisIcon />
      </IconButton>
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
          {actions.slice(2).map(({ label, component }) => (
            <Tooltip key={label} title={label}>
              <span>{component}</span>
            </Tooltip>
          ))}
        </div>
      </Popover>
    </div>
  );
}
