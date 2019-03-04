import { Component } from 'react';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';

@withStyles(theme => ({
  container: {
    paddingLeft: theme.spacing.unit,
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflowY: 'auto',
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing.unit,
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

    // console.log(`"${row}"`, value, field);

    this.setState({ rule });
    onFieldChange(id, rule);
  }

  render() {
    const { classes } = this.props;
    const { rule } = this.state;
    const tableData = rule ? rule.map((r, n) => ({ ...r, row: n })) : [];
    // console.log(rule, tableData);
    const handleKeyUpdate = row => event =>
      this.handleUpdate(row, event, 'key');
    const handleValueUpdate = row => event =>
      this.handleUpdate(row, event, 'value');

    return (
      <div className={classes.container}>
        {tableData.map(r => (
          <div className={classes.rowContainer} key={r.row}>
            <Input
              autoFocus
              defaultValue={r.key}
              placeholder="key"
              className={classes.input}
              onChange={handleKeyUpdate(r.row)}
            />
            <Input
              defaultValue={r.value}
              placeholder="value"
              className={classes.input}
              onChange={handleValueUpdate(r.row)}
            />
          </div>
        ))}
        <div key="new" className={classes.rowContainer}>
          <Input
            value=""
            placeholder="key"
            className={classes.input}
            onChange={handleKeyUpdate()}
          />
          <Input
            value=""
            placeholder="value"
            className={classes.input}
            onChange={handleValueUpdate()}
          />
        </div>
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
