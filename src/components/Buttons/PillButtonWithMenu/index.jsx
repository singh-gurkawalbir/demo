import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { makeStyles, MenuItem, Typography } from '@material-ui/core';
import PillButton from '../PillButton';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../icons/ArrowUpIcon';
import ArrowPopper from '../../ArrowPopper';

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
  pillButtonArrow: {
    display: 'none',
  },
  icon: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    marginRight: theme.spacing(1.5),
    color: theme.palette.secondary.light,
    borderRadius: theme.spacing(0.5),
    width: theme.spacing(6),
    height: theme.spacing(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    padding: theme.spacing(0.5),
    margin: theme.spacing(0, 1, 2),
    overflow: 'visible',
    borderRadius: 2,
    border: 0,
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      '&:before': {
        display: 'none',
      },
    },
    '&:after': {
      content: '""',
      width: 'calc(100% + 16px)',
      height: 1,
      backgroundColor: theme.palette.secondary.lightest,
      position: 'absolute',
      bottom: theme.spacing(-1),
      left: theme.spacing(-1),
    },
    '&+$menuItem': {
      border: 0,
      '&:after': {
        display: 'none',
      },
    },
    '&:nth-child(3)': {
      marginBottom: theme.spacing(0),
      '& $icon': {
        '& svg': {
          fontSize: theme.spacing(2.5),
        },
      },
    },
    '&:last-child': {
      marginBottom: theme.spacing(1),
      '& $icon': {
        '& svg': {
          fontSize: theme.spacing(2),
        },
      },
    },
  },
  dropdownMenuTitle: {
    padding: theme.spacing(2, 2, 1),
    lineHeight: 1,
    fontSize: 11,
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
      <ArrowPopper
        elevation={0}
        id={actionsPopoverId}
        open={open}
        variant="Menu"
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleMenuClose}
        skipMouseEvent
        className={classes.createMenu}
        classes={{
          arrow: classes.pillButtonArrow,
        }}
        transformOrigin={{
          vertical: -36,
          horizontal: 176,
        }}
      >
        {menuTitle && (
          <Typography variant="caption" component="div" className={classes.dropdownMenuTitle}>{menuTitle}</Typography>
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
      </ArrowPopper>
    </>
  );
}
