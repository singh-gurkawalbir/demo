import { Chip, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import EditIcon from '../icons/EditIcon';

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: '0px 8px',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginTop: '-1px',
  },
}));

export default function ChipInput(props) {
  const classes = useStyles();
  const { onChange, disabled = false, value } = props;
  const [tag, setTag] = useState(value);
  const [isChipView, setIsChipView] = useState(true);
  const handleBlur = e => {
    setIsChipView(true);

    if (tag === e.target.value || (!e.target.value && !tag)) {
      return;
    }

    setTag(e.target.value);
    onChange(e.target.value);
  };

  const handleTagClick = e => {
    e.preventDefault();
    setIsChipView(false);
  };

  return (
    <>
      {isChipView && (
      <Chip
        {...props}
        onClick={disabled ? () => {} : handleTagClick}
        clickable={!disabled}
        label={tag || 'tag'}
        size="small"
        icon={<EditIcon />}
      />
      )}
      {!isChipView && (
      <TextField
        variant="standard"
        disabled={disabled}
        id="integration-tag"
        autoFocus
        defaultValue={tag}
        className={classes.textField}
        //   onChange={handleTagChange}
        onBlur={handleBlur} />
      )}
    </>
  );
}
