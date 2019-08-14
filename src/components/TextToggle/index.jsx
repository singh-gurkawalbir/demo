import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles(theme => ({
  root: {
    '& button': {
      // height: 26,
      backgroundColor: props =>
        props.variant === 'appbar' && theme.palette.primary.dark,
      '& p': {
        color: props =>
          props.variant === 'appbar' && theme.palette.primary.light,
      },
    },
    '& button.Mui-selected': {
      backgroundColor: props =>
        props.variant === 'appbar' && theme.palette.primary.light,
      '& p': {
        color: props =>
          props.variant === 'appbar' && theme.palette.primary.contrastText,
      },
    },

    '& button:hover': {
      backgroundColor: props =>
        props.variant === 'appbar' && theme.palette.primary.main,
    },

    '& button.Mui-selected:hover': {
      backgroundColor: props =>
        props.variant === 'appbar' && theme.palette.primary.dark,
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
  },
}));

export default function Toggle({
  options = [],
  defaultValue,
  minWidth,
  variant,
  ...rest
}) {
  const classes = useStyles({ variant, minWidth });
  const [value, setValue] = useState(defaultValue);
  const handleChange = (event, newValue) => {
    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      {...rest}
      className={classes.root}
      value={value}
      onChange={handleChange}>
      {options.map(item => (
        <ToggleButton key={item.value} value={item.value}>
          <Typography className={classes.item} variant="body2">
            {item.label}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
