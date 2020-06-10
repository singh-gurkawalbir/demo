import React from 'react';
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
        color: theme.palette.secondary.light,
        lineHeight: '24px',
      },
    },
    '& button.Mui-selected': {
      borderRadius: 24,
      backgroundColor: theme.palette.text.secondary,
      '& span': {
        color: theme.palette.common.white,
      },
    },
    '& button:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.light,
      borderRadius: 24,
    },
    '& button.Mui-selected:hover': {
      backgroundColor: theme.palette.text.secondary,
    },
    '& button:first-child': {
      borderTopLeftRadius: 24,
      borderBottomLeftRadius: 24,
    },
    '& button:last-child': {
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
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
  ...rest
}) {
  const classes = useStyles({ minWidth });

  function handleChange(event, newValue) {
    if (newValue) {
      if (typeof onChange === 'function') {
        onChange(newValue);
      }
    }
  }

  return (
    <ToggleButtonGroup
      {...rest}
      className={clsx(classes.root, className)}
      value={value}
      onChange={handleChange}>
      {options.map(item => (
        <ToggleButton
          data-test={item.label}
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
