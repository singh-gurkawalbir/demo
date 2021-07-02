import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControlLabel, Checkbox } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  checkAction: {
    paddingLeft: 58,
  },
  name: {
    width: '18.15%',
  },
  status: {
    width: '10.15',
  },
  success: {
    width: '9%',
    textAlign: 'right',
  },
  ignore: {
    width: '7.5%',
    textAlign: 'right',
  },
  error: {
    width: '10.15%',
    textAlign: 'right',
  },
  resolved: {
    width: '9%',
    textAlign: 'right',
  },
  pages: {
    width: '7.5%',
    textAlign: 'right',
  },
  duration: {
    width: '9%',
    textAlign: 'right',
  },
  completed: {
    width: '11.5%',
    whiteSpace: 'nowrap',
  },
  actions: {
    width: '7.5%',
    textAlign: 'center',
  },
  checkActionBorder: {
    paddingLeft: 55,
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  },
  errorCount: {
    color: theme.palette.error.dark,
  },
  selectResourceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
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
