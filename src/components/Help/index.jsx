import { useState, Fragment, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles } from '@material-ui/core/styles';
import ArrowPopper from '../ArrowPopper';
import helpTextMap from './helpTextMap';
import HelpContent from '../HelpContent';
import HelpIcon from '../../components/icons/HelpIcon';
import RawHtml from '../RawHtml';

const useStyles = makeStyles({
  helpIcon: {
    fontSize: 18,
  },
});

function Help(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = useCallback(
    event => {
      // REVIEW: is this ok to be added here?
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
    <Fragment>
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
    </Fragment>
  );
}

export default Help;
