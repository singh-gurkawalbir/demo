import { useState, Fragment } from 'react';
import clsx from 'clsx';
import { fade } from '@material-ui/core/styles';
import { makeStyles, Input } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  text: {
    borderColor: 'transparent',
    transition: theme.transitions.create(['border', 'background-color']),
    maxWidth: 680,
    maxHeight: 60,
    overflow: 'hidden',
    float: 'left',
    '&:hover': {
      backgroundColor: theme.palette.background.paper2,
      borderBottom: `solid 1px ${fade(theme.palette.primary.light, 0.5)}`,
    },
  }, // not used...
  input: {
    font: 'inherit',
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    maxWidth: 'unset',
    marginBottom: -1, // make up for the 1px border.
  },
  muiInputBase: {
    height: 'unset',
    padding: 0,
  },
}));

export default function EditableText({
  onChange,
  disabled,
  className,
  text = '',
  defaultText,
}) {
  const classes = useStyles();
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(text);

  function handleCancel() {
    setIsEdit(false);
    setValue(text);
  }

  function handleChange() {
    setIsEdit(false);

    // only call the onChange if the text actually changed.
    if (value !== text) {
      onChange(value);
    }
  }

  function handleKeyDown(e) {
    // console.log(e.key);
    if (e.key === 'Enter') {
      handleChange();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }

  const handleEditClick = () => {
    if (!disabled) setIsEdit(true);
  };

  return (
    <Fragment>
      {isEdit ? (
        <Input
          autoFocus
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleChange}
          value={value}
          className={clsx(classes.input, className)}
          classes={{ input: classes.muiInputBase }}
        />
      ) : (
        <span
          onClick={handleEditClick}
          className={clsx(classes.text, className)}>
          {text || defaultText}
        </span>
      )}
    </Fragment>
  );
}
