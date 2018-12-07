import { Component } from 'react';
import { connect } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, { editorId }) => ({
  editor: selectors.editor(state, editorId),
});
const mapDispatchToProps = (dispatch, { editorId }) => ({
  patchEditor: (option, value) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
  },
});

@withStyles(theme => ({
  container: {
    padding: '10px',
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },
  formControl: {
    margin: theme.spacing.unit,
    // minWidth: 120,
  },
}))
class CsvParsePanel extends Component {
  render() {
    const { editor, patchEditor, classes } = this.props;
    const {
      columnDelimiter = '',
      rowDelimiter = '',
      // keyColumns,
      hasHeaderRow = true,
      trimSpaces = true,
    } = editor;

    return (
      <div className={classes.container}>
        <FormGroup column="true">
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="columnDelimiter">
              Column Delimiter
            </InputLabel>
            <Select
              native
              value={columnDelimiter}
              onChange={event =>
                patchEditor('columnDelimiter', event.target.value)
              }
              inputProps={{ id: 'columnDelimiter' }}>
              <option value="">Auto Detect</option>
              <option value=",">Comma (,)</option>
              <option value="|">Pipe (|)</option>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="rowDelimiter">
              Row Delimiter
            </InputLabel>
            <Select
              native
              value={rowDelimiter}
              onChange={event =>
                patchEditor('rowDelimiter', event.target.value)
              }
              inputProps={{ id: 'rowDelimiter' }}>
              <option value="">Auto Detect</option>
              <option value="cr">CR (\r)</option>
              <option value="lf">LF (\n)</option>
              <option value="crlf">CRLF (\r\n)</option>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                // color="primary"
                checked={hasHeaderRow}
                onChange={() => patchEditor('hasHeaderRow', !hasHeaderRow)}
              />
            }
            label="Has Header Row"
          />
          <FormControlLabel
            control={
              <Checkbox
                // color="primary"
                checked={trimSpaces}
                onChange={() => patchEditor('trimSpaces', !trimSpaces)}
              />
            }
            label="Trim Spaces"
          />
        </FormGroup>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(CsvParsePanel);
