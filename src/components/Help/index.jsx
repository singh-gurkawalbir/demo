import { useState, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from 'mdi-react/HelpIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowPopper from '../ArrowPopper';
import helpTextMap from './helpTextMap';
import HelpContent from '../HelpContent';

// const styles = theme => ({
//   helpPopper: {
//     maxWidth: '350px',
//     maxHeight: '300px',
//     padding: `${theme.spacing.unit}px ${theme.spacing.double}px`,
//     overflow: 'auto',
//   },
// });

function Help(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = event => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getHelpText = (helpText, helpKey) => helpText || helpTextMap[helpKey];
  const { className, helpKey, helpText } = props;
  const open = !!anchorEl;
  const helpTextValue = getHelpText(helpText, helpKey);

  if (!helpTextValue) return null;

  return (
    <Fragment>
      <ClickAwayListener onClickAway={handleClose}>
        <IconButton className={className} onClick={handleMenu}>
          <HelpIcon fontSize="small" />
        </IconButton>
      </ClickAwayListener>
      <ArrowPopper
        placement="left"
        id="helpBubble"
        open={open}
        anchorEl={anchorEl}>
        <HelpContent title={helpKey}>{helpTextValue}</HelpContent>
      </ArrowPopper>
    </Fragment>
  );
}

export default Help;
