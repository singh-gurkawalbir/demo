import React, { useCallback } from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const rootCss = {
  borderRadius: 24,
  padding: 2,
  '& button': {
    marginLeft: 0,
    height: 22,
    border: 0,
    backgroundColor: 'transparent',
    minWidth: 100,
    '& span': {
      lineHeight: '0px',
    },
  },
  '& button.Mui-selected': {
    borderRadius: 24,
    backgroundColor: theme => theme.palette.background.toggle,
    '& span': {
      color: theme => theme.palette.common.white,
    },
  },
  '& button:hover': {
    backgroundColor: 'transparent',
    color: theme => theme.palette.secondary.light,
    borderRadius: 24,
  },
  '& button.Mui-selected:hover': {
    backgroundColor: theme => theme.palette.background.toggle,
  },
  '& button:first-child': {
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },

  '& button:last-child': {
    borderTopRightRadius: '24px !important',
    borderBottomRightRadius: '24px !important',
  },
};

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
      className={clsx(className)}
      sx={[rootCss, className]}
      value={value}
      onChange={handleChange}>
      {options.map(item => (
        <ToggleButton
          disabled={disabled}
          data-test={item.dataTest || item.label}
          key={item.value}
          value={item.value}
          disableRipple>
          <Typography
            sx={{
              minWidth,
              textTransform: 'none',
              fontSize: 13,
            }}
            variant="body2" component="span">
            {item.label}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
