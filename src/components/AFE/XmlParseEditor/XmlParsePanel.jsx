import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
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
  textField: {
    marginTop: theme.spacing.double,
  },
}))
class CsvParsePanel extends Component {
  render() {
    const { editor, patchEditor, classes } = this.props;
    const {
      leanJson,
      trimSpaces,
      stripNewLineChars,
      textNodeName,
      attributePrefix,
    } = editor;

    return (
      <div className={classes.container}>
        <FormGroup column="true">
          <FormControlLabel
            control={
              <Checkbox
                checked={leanJson}
                onChange={() => patchEditor('leanJson', !leanJson)}
              />
            }
            label="Lean JSON"
          />
          {leanJson && (
            <Fragment>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={leanJson}
                    onChange={() => patchEditor('trimSpaces', !trimSpaces)}
                  />
                }
                label="Trim Spaces"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={stripNewLineChars}
                    onChange={() =>
                      patchEditor('stripNewLineChars', !stripNewLineChars)
                    }
                  />
                }
                label="Strip Newline Chars"
              />

              <TextField
                label="Text Node Name"
                placeholder="&txt"
                className={classes.textField}
                defaultValue={textNodeName}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => patchEditor('textNodeName', e.target.value)}
              />

              <TextField
                label="Attribute Prefix"
                placeholder="none"
                className={classes.textField}
                defaultValue={attributePrefix}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => patchEditor('attributePrefix', e.target.value)}
              />
            </Fragment>
          )}
        </FormGroup>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(CsvParsePanel);
