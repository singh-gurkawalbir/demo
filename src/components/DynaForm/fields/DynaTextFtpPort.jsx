import { useEffect, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    height: 50,
    justifyContent: 'flex-end',
    borderRadius: 2,
    '& > Label': {
      paddingTop: 10,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      padding: [[0, 12]],
    },
    '& > div > input': {
      padding: [[0, 0, 5, 0]],
    },
  },
}));

export default function DynaTextFtpPort(props) {
  const {
    description,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    value,
    label,
    options,
    valueType,
    disabled,
  } = props;
  const classes = useStyle();

  useEffect(() => {
    if ((!value || [21, 22, 990].includes(value)) && options)
      onFieldChange(id, options);
  }, [id, onFieldChange, options, value]);

  const handleFieldChange = useCallback(
    event => {
      const { value, name } = event.target;

      if (!name || name !== props.name) return;

      return onFieldChange(id, value);
    },
    [id, onFieldChange, props.name]
  );

  return (
    <TextField
      autoComplete="off"
      key={id}
      type={valueType}
      name={name}
      data-test={id}
      label={label}
      placeholder={placeholder}
      helperText={isValid ? description : errorMessages}
      disabled={disabled}
      error={!isValid}
      value={value}
      onChange={handleFieldChange}
      className={classes.root}
    />
  );
}
