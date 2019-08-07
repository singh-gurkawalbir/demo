import Input from '@material-ui/core/Input';
import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'react-forms-processor/dist';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import Spinner from '../../Spinner';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit,
    overflowY: 'off',
  },
  tableWidth: {
    width: '100%',
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing.double,
  },
  rowContainer: {
    display: 'flex',
  },
  label: {
    fontSize: '12px',
  },
});

// function KeyValueTable2(props) {
//   console.log('first one');
//   const {
//     classes,
//     label,
//     keyName = 'key',
//     valueName = 'value',
//     description,
//     errorMessages,
//     isValid,
//   } = props;
//   const [rule, setRule] = useState([]);
//   const tableData = rule ? rule.map((r, n) => ({ ...r, row: n })) : [];

//   console.log('second one');
//   const handleUpdate = (row, event, field) => {
//     const { value } = event.target;
//     const { id, onFieldChange } = props;

//     // TODO: Why are all these event fn being called here?
//     // Test if it is even needed...
//     event.preventDefault();
//     event.stopPropagation();
//     event.nativeEvent.stopImmediatePropagation();

//     if (row !== undefined) {
//       rule[row][field] = value;
//     } else {
//       rule.push({ [field]: value });
//     }

//     setRule(rule);
//     onFieldChange(id, rule);
//   };

//   console.log('third one');
//   const handleKeyUpdate = row => event =>
// handleUpdate(row, event, keyName);
//   const handleValueUpdate = row => event =>
//  handleUpdate(row, event, valueName);
//   const isLoading = false;
//   const options = true;
//   const onFetchResource = () => {};

//   console.log('final one');

//   return (
//     <div className={classes.container}>
//       <FormLabel className={classes.label}>{label}</FormLabel>
//       <table Style={classes.tableWidth}>
//         <thead>
//           <tr>
//             <th align="left">
//               <span>row1</span>
//               {!isLoading && <RefreshIcon onClick={onFetchResource} />}
//               {options && isLoading && <Spinner />}
//             </th>
//             <th align="left">
//               <span>row2</span>
//               {!isLoading && <RefreshIcon onClick={onFetchResource} />}
//               {options && isLoading && <Spinner />}
//             </th>
//           </tr>
//         </thead>
//       </table>
//       {tableData.map(r => (
//         <div className={classes.rowContainer} key={r.row}>
//           <Input
//             autoFocus
//             defaultValue={r[keyName]}
//             placeholder="hello"
//             className={classes.input}
//             onChange={handleKeyUpdate(r.row)}
//           />
//           <Input
//             defaultValue={r[valueName]}
//             placeholder="hello2"
//             className={classes.input}
//             onChange={handleValueUpdate(r.row)}
//           />
//         </div>
//       ))}
//       <div key="new" className={classes.rowContainer}>
//         <Input
//           value=""
//           placeholder="hello"
//           className={classes.input}
//           onChange={handleKeyUpdate()}
//         />
//         <Input
//           value=""
//           placeholder="hello2"
//           className={classes.input}
//           onChange={handleValueUpdate()}
//         />
//       </div>
//       <FormHelperText className={classes.helpText}>
//         {isValid ? description : errorMessages}
//       </FormHelperText>
//     </div>
//   );
// }

class KeyValueTable extends Component {
  state = {
    rule: [],
  };

  render() {
    const {
      classes,
      label,
      keyName = 'key222',
      valueName = 'value222',
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
    const isLoading = false;
    const options = true;
    const onFetchResource = () => {};

    return (
      <div className={classes.container}>
        <FormLabel className={classes.label}>{label}</FormLabel>
        <table Style={classes.tableWidth}>
          <thead>
            <tr>
              <th align="left">
                <span>row1</span>
                {!isLoading && <RefreshIcon onClick={onFetchResource} />}
                {options && isLoading && <Spinner />}
              </th>
              <th align="left">
                <span>row2</span>
                {!isLoading && <RefreshIcon onClick={onFetchResource} />}
                {options && isLoading && <Spinner />}
              </th>
            </tr>
          </thead>
        </table>
        {tableData.map(r => (
          <div className={classes.rowContainer} key={r.row}>
            <Input
              autoFocus
              defaultValue={r[keyName]}
              placeholder="hello"
              className={classes.input}
              onChange={handleKeyUpdate(r.row)}
            />
            <Input
              defaultValue={r[valueName]}
              placeholder="hello2"
              className={classes.input}
              onChange={handleValueUpdate(r.row)}
            />
          </div>
        ))}
        <div key="new" className={classes.rowContainer}>
          <Input
            value=""
            placeholder="hello"
            className={classes.input}
            onChange={handleKeyUpdate()}
          />
          <Input
            value=""
            placeholder="hello2"
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

// const StyledStaticMapWidget = withStyles(styles)(KeyValueTable);
const StyleStaticMapWidgetNew = withStyles(styles)(KeyValueTable);
// const DynaKeyValue = props => (
//   <FieldWrapper {...props}>
//     <StyledStaticMapWidget />
//   </FieldWrapper>
// );
const DynaKeyValueNew = props => {
  <FieldWrapper {...props}>
    <StyleStaticMapWidgetNew />
  </FieldWrapper>;
};

export default DynaKeyValueNew;
// export default DynaKeyValueNew;
