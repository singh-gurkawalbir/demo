import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DynaTableView from './DynaTable';

export default function DynaXMLMapper(props) {
  const { onFieldChange, defaultValue, label, id } = props;
  const [path, setPath] = useState(props.path);
  const fieldChangeHandler = (id, val) => {
    if (val && Array.isArray(val)) {
      onFieldChange(id, { path, value: val });
    }
  };

  const handlePathUpdate = e => {
    setPath(e.target.value);
    onFieldChange(id, { path, value: defaultValue });
  };

  const optionsMap = [
    {
      id: 'fieldName',
      label: 'Field Description',
      type: 'input',
      required: true,
      supportsRefresh: false,
    },
    {
      id: 'path',
      label: 'Path',
      required: false,
      type: 'input',
      supportsRefresh: false,
    },
    {
      id: 'regexExpression',
      label: 'Regex',
      required: false,
      type: 'input',
      supportsRefresh: false,
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item>
        <TextField
          defaultValue={path}
          label="Path:"
          placeholder={path}
          margin="normal"
          variant="outlined"
          onChange={handlePathUpdate}
        />
      </Grid>
      <Grid item>
        <DynaTableView
          {...props}
          optionsMap={optionsMap}
          value={defaultValue}
          hideLabel
          onFieldChange={fieldChangeHandler}
        />
      </Grid>
    </Grid>
  );
}
