import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import useFormContext from '../../../Form/FormContext';

const useStyles = makeStyles(theme => ({
  labelTop: {
    padding: theme.spacing(2, 1),
    fontWeight: 'bold',
  },
}));

export default function CronLabel(props) {
  const classes = useStyles();
  const { onFieldChange, id, clearFields, unit, formKey } = props;
  const form = useFormContext(formKey);
  const { fields } = form || {};

  useEffect(() => {
    clearFields.forEach(id => {
      Object.values(fields).some(field => field.id === id) &&
        onFieldChange(id, '');
    });
    onFieldChange(id, '*');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Typography className={classes.labelTop}>{`Every * ${unit}`} </Typography>
  );
}
