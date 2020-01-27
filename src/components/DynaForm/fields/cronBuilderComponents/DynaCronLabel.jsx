import { Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { FormContext } from 'react-forms-processor';

function CronLabel(props) {
  const { onFieldChange, id, clearFields, fields, unit } = props;

  useEffect(() => {
    clearFields.forEach(id => {
      fields.some(field => field.id === id) && onFieldChange(id, '');
    });
    onFieldChange(id, '*');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return <Typography>{`Every * ${unit}`} </Typography>;
}

export default function DynaCronLabel(props) {
  return (
    <FormContext.Consumer>
      {form => <CronLabel {...props} fields={form.fields} />}
    </FormContext.Consumer>
  );
}
