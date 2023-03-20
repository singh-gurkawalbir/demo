import React, { useState, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import makeStyles from '@mui/styles/makeStyles';
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

export default function Help({ className, helpKey, helpText, escapeUnsecuredDomains, disablePortal = true, placement = 'right', ...rest }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const popperRef = React.useRef(null);

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
    if (popperRef.current?.popper && popperRef.current.popper.contains(event.target)) {
      const isCloseButton = event.target.matches('button[data-test=close] *');
      const isYesButton = event.target.matches('button[data-test=yesContentHelpful] *');
      const isFeedbackSubmitButton = event.target.matches('span[data-test=helpFeedbackSubmit] button, span[data-test=helpFeedbackSubmit] *');

      if (!isCloseButton && !isYesButton && !isFeedbackSubmitButton) { return; }
    }
    if (event.target.name === 'feedbackText' ||
    event.target.textContent === 'No' ||
    ['thumbsdownicon', 'noContentHelpful'].includes(event.target.dataset?.test)
    ) return;
    setAnchorEl(null);
  }, []);

  const open = !!anchorEl;
  const helpTextValue = helpText || getHelpTextMap()[helpKey];

  // console.log('what help', helpText, helpKey, getHelpTextMap()[helpKey]);

  if (!helpTextValue) return null;

  return <>
    <ClickAwayListener onClickAway={handleClose}>
      <IconButton className={className} onClick={handleMenu} size="large">
        <HelpIcon className={classes.helpIcon} />
      </IconButton>
    </ClickAwayListener>
    <ArrowPopper
      placement={placement}
      id="helpBubble"
      open={open}
      disablePortal={disablePortal}
      popperRef={popperRef}
      anchorEl={anchorEl}>
      <HelpContent {...rest} updatePosition={() => { popperRef.current.update(); }}>
        {/<\/?[a-z][\s\S]*>/i.test(helpTextValue) ? (
          <RawHtml
            html={helpTextValue}
            options={{allowedTags: ['a', 'p', 'table', 'thead', 'th', 'tr', 'td', 'b', 'i', 'br', 'u', 'ul', 'li'], escapeUnsecuredDomains}} />
        ) : (
          helpTextValue
        )}
      </HelpContent>
    </ArrowPopper>
  </>;
}
