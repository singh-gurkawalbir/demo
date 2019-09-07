import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popover, IconButton } from '@material-ui/core';
import EllipsisIcon from '../../../../components/icons/EllipsisVerticalIcon';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    position: 'sticky',
    display: 'flex',
  },
  action: {
    padding: theme.spacing(0, 0),
  },
  actionColHead: {
    // any smaller and table "giggles" when transitioning to/from hover state
    width: 110,
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
    return <div className={classes.actionContainer}>{actions}</div>;
  }

  return (
    <div className={classes.actionContainer}>
      {actions[0]}
      {actions[1]}

      <IconButton size="small" aria-describedby={id} onClick={handleClick}>
        <EllipsisIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <div className={classes.ellipsisContainer}>{actions.slice(2)}</div>
      </Popover>
    </div>
  );
}
