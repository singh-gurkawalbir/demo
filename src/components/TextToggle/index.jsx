import { useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useAppBarStyles = makeStyles(theme => ({
  root: {
    borderRadius: 24,
    padding: 2,
    backgroundColor: theme.palette.secondary.dark,
    '& button': {
      height: 26,
      border: 0,
      backgroundColor: theme.palette.secondary.dark,
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
      backgroundColor: 'rgba(0,0,0,0.1)',
      borderRadius: 24,
    },

    '& button.Mui-selected:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));
const useStyles = makeStyles({
  root: {
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
  },
});

export default function TextToggle({
  options = [],
  defaultValue,
  minWidth,
  variant,
  ...rest
}) {
  const classes = useStyles({ minWidth });
  const appBarClasses = useAppBarStyles();
  const [value, setValue] = useState(defaultValue);
  const handleChange = (event, newValue) => {
    if (newValue) {
      setValue(newValue);
    }
  };

  const rootClasses =
    variant === 'appbar' ? [classes.root, appBarClasses.root] : classes.root;

  return (
    <ToggleButtonGroup
      {...rest}
      className={classNames(rootClasses)}
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
