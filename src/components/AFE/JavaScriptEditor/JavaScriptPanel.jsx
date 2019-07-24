import { useEffect, useState, Fragment } from 'react';
import { Typography } from '@material-ui/core';
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
import Spinner from '../../Spinner';

const mapStateToProps = (state, { editorId }) => {
  const editor = selectors.editor(state, editorId);
  const getScriptContent = id => {
    const data = selectors.resourceData(state, 'scripts', id);

    if (data && data.merged) {
      return data.merged.content;
    }
  };

  const allScripts = selectors.resourceList(state, { type: 'scripts' })
    .resources;

  return {
    editor,
    allScripts,
    getScriptContent,
  };
};

const mapDispatchToProps = (dispatch, { editorId }) => ({
  patchEditor: (option, value) => {
    if (typeof option === 'string') {
      dispatch(actions.editor.patch(editorId, { [option]: value }));
    } else {
      // option is already an object.
      dispatch(actions.editor.patch(editorId, option));
    }
  },
  requestScript: id => {
    dispatch(actions.resource.request('scripts', id));
  },
});
const styles = theme => ({
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
});
const JavaScriptPanel = props => {
  const [requestedContent, setRequestedContent] = useState(false);
  const setOrRequestContent = scriptId => {
    const { getScriptContent, requestScript, patchEditor } = props;

    if (!scriptId) return;
    const content = getScriptContent(scriptId);

    if (content === undefined) {
      requestScript(scriptId);
      // Shouldnt we update to the selected scriptId
      patchEditor({ scriptId });
      setRequestedContent(true);
    } else {
      patchEditor({ code: content, scriptId });
    }
  };

  useEffect(() => {
    const { editor } = props;

    setOrRequestContent(editor.scriptId);
    // TODO: Surya
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { editor, allScripts, patchEditor, classes, getScriptContent } = props;
  const { code = '', entryFunction = '', scriptId = '' } = editor;
  const requestedScriptContent = getScriptContent(scriptId);

  useEffect(() => {
    // TODO: What if for the requested script is non existent...
    // do we have a timeout for the spinner
    if (requestedScriptContent) {
      patchEditor({ code: requestedScriptContent });
      setRequestedContent(false);
    }
    // TODO: Surya
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedScriptContent]);

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
            onChange={event => setOrRequestContent(event.target.value)}>
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
        {requestedContent ? (
          <Fragment>
            <Typography>Retrieving your script</Typography>
            <Spinner />
          </Fragment>
        ) : (
          <CodePanel
            name="code"
            value={code}
            mode="javascript"
            onChange={code => patchEditor('code', code)}
          />
        )}
      </div>
    </LoadResources>
  );
};

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)
(withStyles(styles)(JavaScriptPanel));
