import { FormLabel, MenuItem } from '@mui/material';
import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import CeligoSelect from '../../../CeligoSelect';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  dataListItem: {
    borderRadius: 0,
    backgroundColor: theme.palette.background.paper,
    '& .MuiMenuItem-root': {
      '&:hover:before': {
        backgroundColor: theme.palette.primary.main,
      },
      padding: theme.spacing(1.5, 2),
    },
  },
}));

const options = [
  {
    label: '30 days',
    value: 30,
    dataTest: 'thirtyDays',
  },
  {
    label: '60 days',
    value: 60,
    dataTest: 'sixtyDays',
  },
  {
    label: '90 days',
    value: 90,
    dataTest: 'nintyDays',
  },
  {
    label: '180 days',
    value: 180,
    dataTest: 'oneEightyDays',
  },
];

export default function DynaSelectDataRetentionPeriod(props) {
  const classes = useStyles();
  const {id, label, value, onFieldChange, maxAllowedDataRetention} = props;
  const isPeriodInValid = useCallback(period => !(period <= maxAllowedDataRetention), [maxAllowedDataRetention]);

  const handlePeriodChange = useCallback(e => {
    onFieldChange(id, e.target.value);
  }, [id, onFieldChange]);

  return (
    <>
      <div>
        <FormLabel htmlFor={id}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <CeligoSelect
        data-test={id}
        value={value}
        onChange={handlePeriodChange}
        inputProps={{ id: 'dataRetentionPeriod' }}
        MenuProps={{
          classes: { paper: classes.dataListItem },
        }}>
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value} data-test={opt.dataTest} disabled={isPeriodInValid(opt.value)}>
            {isPeriodInValid(opt.value) ? `${opt.label} - upgrade required` : opt.label}
          </MenuItem>
        ))}
      </CeligoSelect>
    </>
  );
}
