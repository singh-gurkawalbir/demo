import { useState, Fragment } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Input, Tooltip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  text: {}, // not used...
  input: {
    font: 'inherit',
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    width: 400,
    marginBottom: -1, // make up for the 1px border.
  },
  muiInputBase: {
    height: 'unset',
    padding: 0,
  },
}));

export default function EditableText({ onChange, className, children }) {
  const classes = useStyles();
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(children);

  function handleCancel() {
    setIsEdit(false);
    setValue(children);
  }

  function handleChange() {
    setIsEdit(false);
    onChange(value);
  }

  function handleKeyDown(e) {
    // console.log(e.key);
    if (e.key === 'Enter') {
      handleChange();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }

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
        <Tooltip title="Click to edit flow name" placement="bottom">
          <span
            onClick={() => setIsEdit(true)}
            className={clsx(classes.text, className)}>
            {children}
          </span>
        </Tooltip>
      )}
    </Fragment>
  );
}
