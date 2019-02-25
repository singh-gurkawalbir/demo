import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import helpTextMap from '../../../components/Help/helpTextMap';

const mapStateToProps = (state, { editorId }) => ({
  editor: selectors.editor(state, editorId),
});
const mapDispatchToProps = (dispatch, { editorId }) => ({
  patchEditor: (option, value) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
  },
});

@withStyles(theme => ({
  helpText: {
    whiteSpace: 'pre-line',
  },
  container: {
    padding: '10px',
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflow: 'auto',
  },
  formControl: {
    margin: theme.spacing.unit,
    // minWidth: 120,
  },
  textField: {
    marginTop: theme.spacing.double,
  },
}))
class XmlParsePanel extends Component {
  render() {
    const { editor, patchEditor, classes } = this.props;
    const {
      advanced = false,
      trimSpaces = false,
      stripNewLineChars = false,
      textNodeName,
      attributePrefix,
      listNodes,
      includeNodes,
      resourcePath,
      excludeNodes,
    } = editor;

    return (
      <div className={classes.container}>
        <FormGroup>
          <TextField
            label="Resource path"
            placeholder="none"
            multiline
            rowsMax={4}
            className={classes.textField}
            defaultValue={resourcePath || ''}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => patchEditor('resourcePath', e.target.value)}
          />
          <RadioGroup
            row
            onChange={() => {
              patchEditor('advanced', !advanced);
            }}>
            {['Advanced', 'Simple'].map(label => (
              <FormControlLabel
                key={label}
                control={
                  <Radio
                    checked={label === 'Advanced' ? advanced : !advanced}
                  />
                }
                label={label}
              />
            ))}
          </RadioGroup>

          {!advanced && (
            <Typography variant="caption" className={classes.helpText}>
              {helpTextMap['editor.xml.simple']}
            </Typography>
          )}
          {advanced && (
            <Fragment>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={trimSpaces}
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

              <TextField
                label="List Nodes"
                placeholder="none"
                multiline
                rowsMax={4}
                className={classes.textField}
                defaultValue={listNodes}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => patchEditor('listNodes', e.target.value)}
              />

              <TextField
                label="Nodes to Include"
                placeholder="all"
                multiline
                rowsMax={4}
                className={classes.textField}
                defaultValue={includeNodes}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => patchEditor('includeNodes', e.target.value)}
              />

              <TextField
                label="Nodes to Exclude"
                placeholder="none"
                multiline
                rowsMax={4}
                className={classes.textField}
                defaultValue={excludeNodes}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => patchEditor('excludeNodes', e.target.value)}
              />
            </Fragment>
          )}
        </FormGroup>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(XmlParsePanel);
