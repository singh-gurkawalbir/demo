import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 24,
    padding: 2,
    backgroundColor: theme.palette.secondary.lightest,
    '& button': {
      marginLeft: 0,
      height: 22,
      border: 0,
      backgroundColor: 'transparent',
      minWidth: 100,
      '& span': {
        color: theme.palette.secondary.main,
        lineHeight: '0px',
      },
    },
    '& button.Mui-selected': {
      borderRadius: 24,
      backgroundColor: theme.palette.background.toggle,
      '& span': {
        color: theme.palette.background.paper,
      },
    },
    '& button:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.light,
      borderRadius: 24,
    },
    '& button.Mui-selected:hover': {
      backgroundColor: theme.palette.background.toggle,
    },
    '& button:first-child': {
      borderTopLeftRadius: 24,
      borderBottomLeftRadius: 24,
    },

    '& button:last-child': {
      borderTopRightRadius: '24px !important',
      borderBottomRightRadius: '24px !important',
    },
  },
  item: {
    minWidth: props => props.minWidth,
    textTransform: 'none',
    fontSize: 13,
  },
  toggleButton: {
    marginLeft: 0,
  },
}));

export default function TextToggle({
  options = [],
  value,
  minWidth,
  variant,
  onChange,
  className,
  disabled,
  ...rest
}) {
  const classes = useStyles({ minWidth });

  const handleChange = useCallback((event, newValue) => {
    if (newValue) {
      if (typeof onChange === 'function') {
        onChange(newValue);
      }
    }
  }, [onChange]);

  return (
    <ToggleButtonGroup
      {...rest}
      className={clsx(classes.root, className)}
      value={value}
      onChange={handleChange}>
      {options.map(item => (
        <ToggleButton
          disabled={disabled}
          data-test={item.dataTest || item.label}
          key={item.value}
          value={item.value}
          disableRipple>
          <Typography className={classes.item} variant="body2" component="span">
            {item.label}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
