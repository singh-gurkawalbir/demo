import { useState, Fragment } from 'react';
import clsx from 'clsx';
import { fade } from '@material-ui/core/styles';
import { makeStyles, Input } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  textContainer: {
    width: '100%',
    borderColor: 'transparent',
    transition: theme.transitions.create(['border', 'background-color']),
    '&:hover': {
      cursor: 'text',
      backgroundColor: theme.palette.background.paper2,
      borderBottom: `solid 1px ${fade(theme.palette.primary.light, 0.5)}`,
    },
  },
  overflowText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  input: {
    font: 'inherit',
    borderBottom: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    width: '100%',
    maxWidth: 'unset',
    marginBottom: -1, // make up for the 1px border.
  },
  muiInputBase: {
    height: 'unset',
    width: '100%',
    padding: 0,
  },
}));

export default function EditableText({
  onChange,
  disabled,
  className,
  multiline = false,
  text = '',
  defaultText,
  allowOverflow = false,
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
          multiline={multiline}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleChange}
          value={value}
          className={clsx(classes.input, className)}
          classes={{ input: classes.muiInputBase }}
        />
      ) : (
        <div
          className={clsx(
            classes.textContainer,
            { [classes.overflowText]: !allowOverflow },
            className
          )}>
          <span onClick={handleEditClick}>{text || defaultText}</span>
        </div>
      )}
    </Fragment>
  );
}
