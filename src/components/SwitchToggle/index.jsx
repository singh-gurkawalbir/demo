import React from 'react';
import { makeStyles, fade } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
  switchSlider: {
    display: 'inline-flex',
    position: 'relative',
  },
  switchCheck: {
    position: 'relative',
    width: theme.spacing(7),
    height: theme.spacing(2) + 4,
    appearance: 'none',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: fade(theme.palette.secondary.lightest, 0.1),
    borderRadius: theme.spacing(2) + 4,
    outline: 'none',
    transitionProperty: 'all',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeIn,
    cursor: 'pointer',
    zIndex: 3,
    '&:before': {
      content: "''",
      background: theme.palette.secondary.contrastText,
      color: theme.palette.secondary.light,
      width: theme.spacing(2),
      height: theme.spacing(2),
      textAlign: 'center',
      position: 'absolute',
      borderRadius: '50%',
      top: 1,
      left: 1,
      fontSize: 13,
      transitionProperty: 'all',
      transitionDuration: theme.transitions.duration.shortest,
      transitionTimingFunction: theme.transitions.easing.easeIn,
      zIndex: 2,
    },
    '&:after': {
      content: "'off'",
      color: theme.palette.secondary.light,
      background: fade(theme.palette.secondary.lightest, 0.2),
      position: 'absolute',
      fontSize: 12,
      lineHeight: '18px',
      top: 0,
      left: 0,
      width: '100%',
      textAlign: 'center',
      borderRadius: '20px',
    },
    '&:checked': {
      '&:before': {
        transform: `translateX(36px)`,
        content: "''",
        backgroundColor: theme.palette.success.main,
      },
      '&:after': {
        content: "'on'",
        left: 0,
        backgroundColor: theme.palette.background.paper,
        width: '85%',
      },
    },
  },
}));

export default function SwitchOnOff({ on = false, onClick, ...rest }) {
  const classes = useStyle();
  const [isOn, setIsOn] = React.useState(on);

  return (
    <div
      onClick={onClick ? () => onClick(isOn) : undefined}
      className={classes.switchSlider}>
      <input
        type="checkbox"
        {...rest}
        checked={isOn}
        className={classes.switchCheck}
        onChange={() => setIsOn(!isOn)}
      />
    </div>
  );
}
