import { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

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
  const classes = useStyles(props);
  const [rule, setRule] = useState([]);

  useEffect(() => {
    if (value) {
      setRule(value);
    }
  }, [value]);

  const handleUpdate = (row, event, field) => {
    const { value } = event.target;

    if (row !== undefined) {
      rule[row][field] = value;
    } else {
      rule.push({ [field]: value });
    }

    // console.log(`row: ${row || 'new'}.${field} = ${value}`);

    setRule(rule);
    onFieldChange(id, rule);
  };

  const tableData = rule ? rule.map((r, n) => ({ ...r, row: n })) : [];
  const handleKeyUpdate = row => event => handleUpdate(row, event, keyName);
  const handleValueUpdate = row => event => handleUpdate(row, event, valueName);

  return (
    <div className={classes.container}>
      <FormLabel className={classes.label}>{label}</FormLabel>
      {tableData.map(r => (
        <div className={classes.rowContainer} key={r.row}>
          <Input
            autoFocus
            defaultValue={r[keyName]}
            placeholder={keyName}
            className={classes.input}
            onChange={handleKeyUpdate(r.row)}
          />
          <Input
            defaultValue={r[valueName]}
            placeholder={valueName}
            className={classes.input}
            onChange={handleValueUpdate(r.row)}
          />
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
