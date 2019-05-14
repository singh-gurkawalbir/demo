import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LoadResources from '../../../components/LoadResources';
import CodePanel from '../GenericEditor/CodePanel';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, { editorId }) => {
  const editor = selectors.editor(state, editorId);
  const allScripts = selectors.resourceList(state, { type: 'scripts' })
    .resources;

  return {
    editor,
    allScripts,
  };
};

const mapDispatchToProps = (dispatch, { editorId }) => ({
  patchEditor: (option, value) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
  },
  requestScript: id => {
    dispatch(actions.resource.request('scripts', id));
  },
});

@withStyles(theme => ({
  container: {
    // padding: '10px',
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },
  textField: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    width: '50%',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  label: {
    paddingLeft: theme.spacing.unit,
  },
}))
class JavaScriptPanel extends Component {
  patchOrRequestContent(scriptId) {
    const { allScripts, requestScript, patchEditor } = this.props;

    if (!scriptId) return;
    const script = allScripts.find(s => s._id === scriptId);

    if (script) {
      if (script.content !== undefined) {
        patchEditor('code', script.content);
      } else {
        requestScript(scriptId);
      }
    }
  }

  componentDidMount() {
    const { editor } = this.props;

    this.patchOrRequestContent(editor.scriptId);
  }

  render() {
    const { editor, allScripts, patchEditor, classes } = this.props;
    const { code = '', entryFunction = '', scriptId = '' } = editor;

    return (
      <LoadResources required resources={['scripts']}>
        <div className={classes.container}>
          <FormControl className={classes.textField}>
            <InputLabel className={classes.label} htmlFor="scriptId">
              Script
            </InputLabel>
            <Select
              id="scriptId"
              margin="dense"
              value={scriptId}
              onChange={event =>
                this.patchOrRequestContent(event.target.value)
              }>
              {allScripts.map(s => (
                <MenuItem key={s._id} value={s._id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="entryFunction"
            InputLabelProps={{ className: classes.label }}
            className={classes.textField}
            value={entryFunction}
            onChange={event => patchEditor('entryFunction', event.target.value)}
            label="Entry Function"
            margin="dense"
          />
          <CodePanel
            name="code"
            value={code}
            mode="javascript"
            onChange={code => patchEditor('code', code)}
          />
        </div>
      </LoadResources>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(JavaScriptPanel);
