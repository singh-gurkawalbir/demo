import { Typography } from '@material-ui/core';
import { useEffect } from 'react';
import useFormContext from '../../../Form/FormContext';

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
  const form = useFormContext(props);

  return <CronLabel {...props} fields={form.fields} />;
}
