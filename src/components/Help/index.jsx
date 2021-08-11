import React, { useState, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles } from '@material-ui/core/styles';
import ArrowPopper from '../ArrowPopper';
import HelpContent from '../HelpContent';
import HelpIcon from '../icons/HelpIcon';
import RawHtml from '../RawHtml';
import retry from '../../utils/retry';

let _helpTextMap = {};

export function getHelpTextMap() {
  return _helpTextMap;
}

retry(() => import(/* webpackChunkName: "HelpTextMap", webpackPreload: true */ './helpTextMap').then(({ default: tm }) => {
  _helpTextMap = tm || {};
}).catch(() => {}));

const useStyles = makeStyles(theme => ({
  helpIcon: {
    fontSize: 16,
    color: theme.palette.text.hint,
  },
}));

export default function Help({ className, helpKey, helpText, ...rest }) {
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
    // if clicking interacting with feedback text field  or if clicking on No button
    // do not close popper
    if (event.target.name === 'feedbackText' ||
    event.target.textContent === 'No'
    ) return;
    setAnchorEl(null);
  }, []);

  const open = !!anchorEl;
  const helpTextValue = helpText || getHelpTextMap()[helpKey];
  // console.log('what help', helpText, helpKey, getHelpTextMap()[helpKey]);

  if (!helpTextValue) return null;

  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <IconButton className={className} onClick={handleMenu}>
          <HelpIcon className={classes.helpIcon} />
        </IconButton>
      </ClickAwayListener>
      <ArrowPopper
        placement="right"
        id="helpBubble"
        open={open}
        disablePortal
        anchorEl={anchorEl}>
        <HelpContent {...rest}>
          {/<\/?[a-z][\s\S]*>/i.test(helpTextValue) ? (
            <RawHtml html={helpTextValue} options={{allowedTags: ['a', 'p', 'table', 'thead', 'th', 'tr', 'td', 'b', 'i', 'br']}} />
          ) : (
            helpTextValue
          )}
        </HelpContent>
      </ArrowPopper>
    </>
  );
}
