import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { FormContext } from 'react-forms-processor';

const useStyles = makeStyles(theme => ({
  labelTop: {
    padding: theme.spacing(2, 1),
    fontWeight: 'bold',
  },
}));

function CronLabel(props) {
  const classes = useStyles();
  const { onFieldChange, id, clearFields, fields, unit } = props;

  useEffect(() => {
    clearFields.forEach(id => {
      fields.some(field => field.id === id) && onFieldChange(id, '');
    });
    onFieldChange(id, '*');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Typography className={classes.labelTop}>{`Every * ${unit}`} </Typography>
  );
}

export default function DynaCronLabel(props) {
  return (
    <FormContext.Consumer>
      {form => <CronLabel {...props} fields={form.fields} />}
    </FormContext.Consumer>
  );
}
