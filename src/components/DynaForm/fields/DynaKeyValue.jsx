import { Component } from 'react';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

@withStyles(theme => ({
  container: {
    // border: 'solid 1px',
    // borderColor: theme.palette.text.disabled,
    // backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing.unit,
    overflowY: 'off',
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing.double,
  },
  rowContainer: {
    display: 'flex',
  },
}))
class KeyValueTable extends Component {
  state = {
    rule: [],
  };

  handleUpdate(row, event, field) {
    const { value } = event.target;
    const { id, onFieldChange } = this.props;
    const { rule } = this.state;

    // TODO: Why are all these event fn being called here?
    // Test if it is even needed...
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    if (row !== undefined) {
      rule[row][field] = value;
    } else {
      rule.push({ [field]: value });
    }

    // console.log(`row: ${row || 'new'}.${field} = ${value}`);

    this.setState({ rule });
    onFieldChange(id, rule);
  }

  render() {
    const {
      classes,
      label,
      keyName = 'key',
      valueName = 'value',
      description,
      errorMessages,
      isValid,
    } = this.props;
    const { rule } = this.state;
    const tableData = rule ? rule.map((r, n) => ({ ...r, row: n })) : [];
    // console.log(rule, tableData);
    const handleKeyUpdate = row => event =>
      this.handleUpdate(row, event, keyName);
    const handleValueUpdate = row => event =>
      this.handleUpdate(row, event, valueName);

    return (
      <div className={classes.container}>
        <FormLabel>{label}</FormLabel>
        {tableData.map(r => (
          <div className={classes.rowContainer} key={r.row || 'new'}>
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
}

const DynaKeyValue = props => (
  <FieldWrapper {...props}>
    <KeyValueTable />
  </FieldWrapper>
);

export default DynaKeyValue;
