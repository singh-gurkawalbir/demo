import React, { useState, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles } from '@material-ui/core/styles';
import ArrowPopper from '../ArrowPopper';
import helpTextMap from './helpTextMap';
import HelpContent from '../HelpContent';
import HelpIcon from '../icons/HelpIcon';
import RawHtml from '../RawHtml';

const useStyles = makeStyles(theme => ({
  helpIcon: {
    fontSize: 18,
    color: theme.palette.text.hint,
  },
}));

function Help(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = useCallback(
    event => {
      event.stopPropagation();

      if (anchorEl) {
        setAnchorEl(null);
      } else {
        setAnchorEl(event.currentTarget);
      }
    },
    [anchorEl]
  );
  const handleClose = useCallback(event => {
    // if clicking interacting with feedback text field do not close popper
    if (event.target.name === 'feedbackText') return;
    setAnchorEl(null);
  }, []);
  const { className, helpKey, helpText, ...rest } = props;
  const open = !!anchorEl;
  const helpTextValue = helpText || helpTextMap[helpKey];

  if (!helpTextValue) return null;

  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <IconButton className={className} onClick={handleMenu}>
          <HelpIcon className={classes.helpIcon} />
        </IconButton>
      </ClickAwayListener>
      <ArrowPopper
        placement="left"
        id="helpBubble"
        open={open}
        disablePortal
        anchorEl={anchorEl}>
        <HelpContent {...rest}>
          {/<\/?[a-z][\s\S]*>/i.test(helpTextValue) ? (
            <RawHtml html={helpTextValue} />
          ) : (
            helpTextValue
          )}
        </HelpContent>
      </ArrowPopper>
    </>
  );
}

export default Help;
