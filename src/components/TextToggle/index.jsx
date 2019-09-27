import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
      height: 20,
      border: 0,
      backgroundColor: 'transparent',
      minWidth: 100,
      '& p': {
        color: theme.palette.secondary.light,
      },
    },
    '& button.Mui-selected': {
      borderRadius: 24,
      backgroundColor: theme.palette.primary.main,
      '& p': {
        color: theme.palette.common.white,
      },
    },
    '& button:hover': {
      backgroundColor: 'rgba(0,0,0,0.05)',
      color: theme.palette.secondary.light,
      borderRadius: 24,
    },
    '& button.Mui-selected:hover': {
      backgroundColor: theme.palette.primary.main,
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
  defaultValue,
  minWidth,
  variant,
  ...rest
}) {
  const classes = useStyles({ minWidth });
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
        <ToggleButton key={item.value} value={item.value} disableRipple>
          <Typography className={classes.item} variant="body2">
            {item.label}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
