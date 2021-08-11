import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import WarningIcon from '../../../icons/WarningIcon';
import DynaCheckbox from './DynaCheckbox';

const useStyles = makeStyles(theme => ({
  warning: {
    color: theme.palette.warning.main,
    height: theme.spacing(2),
  },
  resetFields: {
    display: 'flex',
    '& .MuiFormControl-root': {
    },
  },
  warningMessage: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function DynaCheckboxForResetFields(props) {
  const classes = useStyles();

  const { fieldsToReset, onFieldChange, id, value, showDeprecatedMessage } = props;

  const updatedOnFieldChange = (id, value) => {
    fieldsToReset.forEach(field => {
      const { type, id: _id, value } = field;

      const defValue = type === 'checkbox' ? false : '';
      const resetValue = 'value' in field ? value : defValue;

      onFieldChange(_id, resetValue, true);
    });
    onFieldChange(id, value);
  };

  if (['rowsPerRecord', 'file.xlsx.rowsPerRecord'].includes(id) && !value) {
    return null;
  }

  return (
    <div className={classes.resetFields}>
      <DynaCheckbox {...props} onFieldChange={updatedOnFieldChange} />
      {showDeprecatedMessage ? <Typography component="div" variant="caption" className={classes.warningMessage}><WarningIcon className={classes.warning} /> Deprecated option.</Typography> : ''}
    </div>
  );
}
