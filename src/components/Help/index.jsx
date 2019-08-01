import { useState, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HelpIcon from 'mdi-react/HelpIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowPopper from '../ArrowPopper';
import helpTextMap from './helpTextMap';

const styles = theme => ({
  helpPopper: {
    maxWidth: '350px',
    maxHeight: '300px',
    padding: `${theme.spacing.unit}px ${theme.spacing.double}px`,
    overflow: 'auto',
  },
});

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
  const { classes, className, helpKey, helpText } = props;
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
        className={classes.helpPopper}
        id="helpBubble"
        open={open}
        anchorEl={anchorEl}>
        <Typography variant="caption">{helpTextValue}</Typography>
      </ArrowPopper>
    </Fragment>
  );
}

export default withStyles(styles)(Help);
