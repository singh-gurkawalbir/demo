import { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
  container: {
    // border: 'solid 1px',
    // borderColor: theme.palette.text.disabled,
    // backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing(2),
  },
  rowContainer: {
    display: 'flex',
  },
  label: {
    fontSize: '12px',
  },
}));

export default function DynaKeyValue(props) {
  const {
    id,
    value,
    onFieldChange,
    label,
    keyName = 'key',
    valueName = 'value',
    description,
    errorMessages,
    isValid,
  } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (value) {
      setValues(value);
    }
  }, [value]);

  const handleUpdate = (row, event, field) => {
    const { value } = event.target;

    if (row !== undefined) {
      values[row][field] = value;
    } else {
      values.push({ [field]: value });
    }

    // console.log(`row: ${row || 'new'}.${field} = ${value}`);

    setValues(values);
    onFieldChange(id, values);
  };

  const tableData = values ? values.map((r, n) => ({ ...r, row: n })) : [];
  const handleKeyUpdate = row => event => handleUpdate(row, event, keyName);
  const handleValueUpdate = row => event => handleUpdate(row, event, valueName);

  return (
    <div data-test={id} className={classes.container}>
      <FormLabel className={classes.label}>{label}</FormLabel>
      {tableData.map(r => (
        <div className={classes.rowContainer} key={r.row}>
          <FormControl>
            <Input
              autoFocus
              defaultValue={r[keyName]}
              placeholder={keyName}
              className={classes.input}
              onChange={handleKeyUpdate(r.row)}
            />
          </FormControl>
          <FormControl>
            <Input
              defaultValue={r[valueName]}
              placeholder={valueName}
              className={classes.input}
              onChange={handleValueUpdate(r.row)}
            />
          </FormControl>
        </div>
      ))}
      <div key="new" className={classes.rowContainer}>
        <Input
          value=""
          placeholder={keyName}
          className={classes.input}
          onChange={handleKeyUpdate()}
        />
        <Input
          value=""
          placeholder={valueName}
          className={classes.input}
          onChange={handleValueUpdate()}
        />
      </div>
      <FormHelperText className={classes.helpText}>
        {isValid ? description : errorMessages}
      </FormHelperText>
    </div>
  );
}
