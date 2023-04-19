import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { ListItem, makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';
import PillButton from '../PillButton';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../icons/ArrowUpIcon';

const useStyles = makeStyles(() => ({
  label: {
    fontSize: '16px',
  },
  menutitle: {
    fontSize: '10px',
  },
  description: {
    fontSize: '12px',
  },
  icon: {
    maxwidth: '12px',
    marginRight: '12px',
  },
}));

const ActionLabel = ({label, classes, description, Icon}) => (
  <>
    <Icon className={classes.icon} />
    <div>
      <span className={classes.label}>
        {label}
      </span>
      <div className={classes.description}>
        {description}
      </div>
    </div>
  </>
);

export default function PillButtonWithMenu({label, actionsMenu, fill, menuTitle}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'create-actions' : undefined;

  return (
    <>
      <PillButton
        color="primary"
        onClick={handleMenuClick}
        fill={fill}
        aria-controls={actionsPopoverId}
        endIcon={open ? <ArrowUpIcon /> : <ArrowDownIcon />}
     >
        {label}
      </PillButton>
      <Menu
        elevation={2}
        id={actionsPopoverId}
        open={open}
        variant="Menu"
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleMenuClose}
      >
        {menuTitle && (
        <ListItem>
          <Typography className={classes.menutitle}>{menuTitle}</Typography>
        </ListItem>
        )}
        {actionsMenu?.map(({ Icon, label, disabled, description, link }) => (
          <MenuItem
            key={label}
            data-test={`Create-${label}`}
            disabled={disabled}
            component={Link}
            to={link}>
            <ActionLabel
              classes={classes} Icon={Icon} label={label} description={description}
              disabled={disabled} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
