// import { makeStyles } from '@material-ui/core/styles';
// import Input from '@material-ui/core/Input';
import DynaKeyValue from '../../DynaForm/fields/DynaKeyValue';

// WIP
// const useStyles = makeStyles(theme => ({
//   container: {
//     paddingLeft: theme.spacing(1),
//     backgroundColor: theme.palette.background.default,
//     height: '100%',
//     overflowY: 'auto',
//   },
//   input: {
//     flex: '1 1 auto',
//     marginRight: theme.spacing(1),
//   },
//   rowContainer: {
//     display: 'flex',
//   },
// }));

export default function HttpStaticImport() {
  // WIP
  // const classes = useStyles(props);
  // const handleUpdate = (row, event, field) => {
  //   const { value } = event.target;
  //   let { rule } = [];

  //   if (!rule) rule = [];

  //   event.preventDefault();
  //   event.stopPropagation();
  //   event.nativeEvent.stopImmediatePropagation();

  //   if (row !== undefined) {
  //     rule[row][field] = value;
  //   } else {
  //     rule.push({ [field]: value });
  //   }
  // };

  // const handleExtractUpdate = row => event =>
  //   handleUpdate(row, event, 'extract');
  // const handleGenerateUpdate = row => event =>
  //   handleUpdate(row, event, 'generate');
  // const rule = [];

  return (
    <DynaKeyValue
    // onFieldChange={handleUpdate}
    // keyName="Export Field"
    // valueName="Import Field (HTTP)"
    />
  );
}
