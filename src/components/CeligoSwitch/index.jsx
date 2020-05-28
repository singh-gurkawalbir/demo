import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { makeStyles } from '@material-ui/core';
import SwitchOffIcon from '../icons/Switch/Off';
import SwitchOnIcon from '../icons/Switch/On';

const useStyles = makeStyles(theme => ({
  customSwitch: {
    '& > .react-toggle-thumb': {
      borderColor: 'transparent',
    },
    '& > .react-toggle-track': {
      backgroundColor: theme.palette.text.disabled,
      opacity: '0.9',
    },
    '&.react-toggle--checked': {
      '&.react-toggle-track': {
        backgroundColor: theme.col,
        opacity: '1',
      },
    },
    '& > .react-toggle-track-x': {
      width: 12,
      height: 12,
    },
    '& > .react-toggle-track-check': {
      width: 17,
      height: 12,
    },
    '&.react-toggle:hover:not(.react-toggle--disabled)': {
      '& > .react-toggle-track': {
        backgroundColor: theme.palette.text.hint,
      },
    },
  },
}));

export default function CeligoSwitch({
  enabled = false,
  disabled,
  onChange,
  ...props
}) {
  const classes = useStyles();

  return (
    <Toggle
      {...props}
      className={classes.customSwitch}
      disabled={disabled}
      onChange={onChange}
      checked={enabled}
      icons={{
        checked: <SwitchOnIcon />,
        unchecked: <SwitchOffIcon />,
      }}
    />
  );
}
