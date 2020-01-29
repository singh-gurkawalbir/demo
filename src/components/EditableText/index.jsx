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
    border: `solid 1px ${fade(theme.palette.primary.light, 0.5)}`,
    width: '100%',
    maxWidth: 'unset',
    marginBottom: 0,
    marginRight: 3,
  },
  multiline: {
    padding: [[4, 4, 0, 4]],
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    margin: [[4, 0]],
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
  inputClassName,
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
          className={clsx(
            classes.input,
            { [classes.multiline]: multiline },
            inputClassName
          )}
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
