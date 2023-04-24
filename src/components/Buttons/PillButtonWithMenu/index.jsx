import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { ListItem, makeStyles, Menu, MenuItem, Typography } from '@mui/material';
import PillButton from '../PillButton';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../icons/ArrowUpIcon';

const useStyles = makeStyles(theme => ({
  description: {
    fontSize: 12,
    color: theme.palette.secondary.light,
  },
  createMenu: {
    '& .MuiMenu-paper': {
      border: `1px solid ${theme.palette.secondary.lightest}`,
      width: 256,
    },
  },
  icon: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1.5),
    display: 'flex',
    marginRight: theme.spacing(1.5),
    color: theme.palette.secondary.light,
    borderRadius: theme.spacing(0.5),
    '& svg': {
      fontSize: theme.spacing(2.5),
    },
  },
  menuItem: {
    padding: theme.spacing(1, 2, 2),
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      '&:before': {
        display: 'none',
      },
    },
    '&+$menuItem': {
      border: 0,
      padding: theme.spacing(0.5, 2),
    },
    '&:nth-child(3)': {
      marginTop: theme.spacing(1.5),
    },
    '&:last-child': {
      paddingBottom: theme.spacing(1),
    },
  },
}));

const ActionLabel = ({label, classes, description, Icon}) => (
  <>
    <span className={classes.icon}>
      <Icon />
    </span>
    <div>
      <Typography variant="subtitle2">{label}</Typography>
      <Typography variant="subtitle2" className={classes.description}>{description}</Typography>
    </div>
  </>
);

export default function PillButtonWithMenu({label, actionsMenu, fill, menuTitle, className}) {
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
        className={className}
     >
        {label}
      </PillButton>
      <Menu
        elevation={0}
        id={actionsPopoverId}
        open={open}
        variant="Menu"
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleMenuClose}
        className={classes.createMenu}
        transformOrigin={{
          vertical: -34,
          horizontal: 176,
        }}
      >
        {menuTitle && (
        <ListItem>
          <Typography variant="caption">{menuTitle}</Typography>
        </ListItem>
        )}
        {actionsMenu?.map(({ Icon, dataTestId, label, disabled, description, link }) => (
          <MenuItem
            key={label}
            data-test={dataTestId || `Create-${label}`}
            disabled={disabled}
            component={Link}
            to={link}
            onClick={handleMenuClose}
            className={classes.menuItem}>
            <ActionLabel
              classes={classes} Icon={Icon} label={label} description={description}
              disabled={disabled} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
