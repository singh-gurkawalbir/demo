import React from 'react';
import Toggle from 'react-toggle';
import clsx from 'clsx';
import 'react-toggle/style.css';
import { makeStyles } from '@material-ui/core';
import SwitchOffIcon from '../icons/Switch/Off';
import SwitchOnIcon from '../icons/Switch/On';


const useStyles = makeStyles(theme => ({
  customSwitch: {
    '& > .react-toggle-track': {
      backgroundColor: theme.palette.text.disabled,
      opacity: '0.9',
      width: 48,
      height: 20,
      '& > .react-toggle-track-check': {
        width: 17,
        height: 12,
        '& > .MuiSvgIcon-root': {
          fontSize: '100%',
        },
      },
      '& > .react-toggle-track-x': {
        width: 12,
        height: 12,
        '& > .MuiSvgIcon-root': {
          fontSize: 24,
        },
      },

    },

    '& > .react-toggle-thumb': {
      borderColor: 'transparent',
      width: 16,
      height: 16,
      left: 2,
      top: 2,
    },


    '&.react-toggle:hover:not(.react-toggle--disabled)': {
      '& > .react-toggle-track': {
        backgroundColor: theme.palette.text.hint,
      },
    },
  },
  customSwitchChecked: {
    '& > .react-toggle-track': {
      backgroundColor: `${theme.palette.success.main} !important`,
      '& > .react-toggle-track-check': {
        width: 16,
        height: 12,
        '& > .MuiSvgIcon-root': {
          fontSize: 24,
        },
      },
    },
    '& > .react-toggle-thumb': {
      left: '30px !important',
      border: 'none  !important',
    },
  }

}));

export default function CeligoSwitch({
  enabled = false,
  disabled,
  onChange,
  className,
  ...props
}) {
  const classes = useStyles();

  return (
    <Toggle
      {...props}
      className={clsx(classes.customSwitch, className, {[classes.customSwitchChecked]: enabled})}
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
