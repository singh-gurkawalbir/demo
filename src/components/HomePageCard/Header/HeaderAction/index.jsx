import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/styles';
import EllipsisIconVertical from '../../../icons/EllipsisVerticalIcon';

const useStyles = makeStyles(theme => ({
  menu: {
    width: 180,
    '& MuiMenu-paper': {
      maxHeight: '250px',
    },
    '& ul': {
      padding: 0,
    },
  },
  menuitem: {
    minWidth: 145,
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    fontSize: 15,
    transition: `all .4s ease`,
    padding: '8px 10px',
    fontFamily: 'source sans pro',
    minHeight: 'unset',
    lineHeight: '19px',
  },

  item: {
    background: theme.palette.background.default,
  },
  action: {
    padding: 6,
    marginTop: 5,
    '&:hover': {
      background: theme.palette.background.paper2,
    },
  },
}));

function HeaderAction(props) {
  const { variants } = props;
  const classes = useStyles();
  const options = variants;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className={classes.action}>
        <EllipsisIconVertical />
      </IconButton>
      <Menu
        className={classes.menu}
        elevation={2}
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}>
        {options.map(option => (
          <MenuItem
            key={option}
            className={classes.menuitem}
            selected={option === 'settings'}
            onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default HeaderAction;
