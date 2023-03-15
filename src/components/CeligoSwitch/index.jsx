import React from 'react';
import Toggle from 'react-toggle';
import clsx from 'clsx';
import 'react-toggle/style.css';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import SwitchOffIcon from '../icons/Switch/Off';
import SwitchOnIcon from '../icons/Switch/On';
import IconButtonWithTooltip from '../IconButtonWithTooltip';

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
  },
  noPadding: {
    padding: 0,
  },
}));

export default function CeligoSwitch({
  checked = false,
  disabled,
  onChange,
  className,
  tooltip,
  placement = 'bottom',
  noPadding = false,
  ...props
}) {
  const classes = useStyles();

  if (tooltip) {
    return (
      <IconButtonWithTooltip tooltipProps={{title: tooltip, placement}} className={clsx({[classes.noPadding]: noPadding}, className)}>
        <Toggle
          {...props}
          className={clsx(classes.customSwitch, {[classes.customSwitchChecked]: checked}, className)}
          disabled={disabled}
          onChange={onChange}
          checked={checked}
          icons={{
            checked: <SwitchOnIcon />,
            unchecked: <SwitchOffIcon />,
          }}
    />
      </IconButtonWithTooltip>
    );
  }

  return (
    <Toggle
      {...props}
      className={clsx(classes.customSwitch, {[classes.customSwitchChecked]: checked}, className)}
      disabled={disabled}
      onChange={onChange}
      checked={checked}
      icons={{
        checked: <SwitchOnIcon />,
        unchecked: <SwitchOffIcon />,
      }}
    />
  );
}

CeligoSwitch.propTypes = {
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
  noPadding: PropTypes.bool,
};

CeligoSwitch.defaultProps = {
  checked: false,
};
