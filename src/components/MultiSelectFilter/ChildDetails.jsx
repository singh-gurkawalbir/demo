import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { FormControlLabel, Checkbox } from '@mui/material';

const useStyles = makeStyles(theme => ({
  selectResourceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    '& > .MuiFormControlLabel-label': {
      fontSize: theme.spacing(2),
    },
  },
  selectResourceCheck: {
    marginTop: theme.spacing(-0.5),
    marginRight: theme.spacing(0.5),
  },
}));

export default function ChildJobDetail({
  current,
  handleSelect,
  checked,
  parentId,
}) {
  const classes = useStyles();

  return (
    <FormControlLabel
      className={classes.selectResourceItem}
      control={(
        <Checkbox
          color="primary"
          checked={checked.includes(current._id)}
          onChange={handleSelect(current._id, parentId)}
          value="required"
          className={classes.selectResourceCheck} />
          )}
      label={current.name}
      key={current._id}
    />
  );
}
