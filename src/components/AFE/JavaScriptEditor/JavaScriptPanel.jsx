import { useEffect, useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import LoadResources from '../../../components/LoadResources';
import CodePanel from '../GenericEditor/CodePanel';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import { hooksLabelMap, getScriptHookStub } from '../../../utils/hooks';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    // Changing this from 50% to 33% to accomodate 3 elements
    // TODO:@Azhar Make this flexible layout to fix  multiple elements instead of having width
    width: '33%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  label: {
    paddingLeft: theme.spacing(1),
  },
  scriptPanel: {
    width: '100%',
    height: '100%',
  },
}));

export default function JavaScriptPanel(props) {
  const { editorId, disabled, insertStubKey } = props;
  const classes = useStyles(props);
  const {
    code = '',
    initChangeIdentifier,
    error,
    fetchScriptContent = false,
    entryFunction = '',
    scriptId = '',
  } = useSelector(state => selectors.editor(state, editorId));
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const scriptContent = useSelector(state => {
    const data = selectors.resourceData(state, 'scripts', scriptId);

    return data && data.merged && data.merged.content;
  });
  const allScripts = useSelector(
    state => selectors.resourceList(state, { type: 'scripts' }).resources
  );
  const dispatch = useDispatch();
  const patchEditor = useCallback(
    val => {
      dispatch(actions.editor.patch(editorId, val));
    },
    [dispatch, editorId]
  );
  const requestScript = useCallback(() => {
    dispatch(actions.resource.request('scripts', scriptId));
  }, [dispatch, scriptId]);
  const handleCodeChange = useCallback(code => patchEditor({ code }), [
    patchEditor,
  ]);
  const handleScriptChange = useCallback(
    event => {
      if (!event.target.value) {
        return patchEditor({
          scriptId: '',
          code: '',
          entryFunction: '',
        });
      }

      patchEditor({ scriptId: event.target.value, fetchScriptContent: true });
    },
    [patchEditor]
  );
  const handleInsertStubClick = useCallback(() => {
    // Fetches stub and appends it to current script content
    const updatedScriptContent = code + getScriptHookStub(insertStubKey);

    // Updated this new script content on editor
    patchEditor({ code: updatedScriptContent });
  }, [code, insertStubKey, patchEditor]);

  useEffect(() => {
    if (fetchScriptContent && scriptContent !== undefined) {
      patchEditor({
        code: scriptContent,
        fetchScriptContent: false,
        initChangeIdentifier: initChangeIdentifier + 1,
      });
    } else if (scriptContent === undefined && scriptId) {
      requestScript();
    }
  }, [
    editorId,
    fetchScriptContent,
    initChangeIdentifier,
    patchEditor,
    requestScript,
    scriptContent,
    scriptId,
  ]);
  const defaultItem = (
    <MenuItem key="" value="">
      None
    </MenuItem>
  );
  const scriptOptions = allScripts.map(s => (
    <MenuItem key={s._id} value={s._id}>
      {s.name}
    </MenuItem>
  ));

  return (
    <LoadResources required resources={['scripts']}>
      <div className={classes.container}>
        <div>
          <FormControl className={classes.textField}>
            <InputLabel className={classes.label} htmlFor="scriptId">
              Script
            </InputLabel>
            <Select
              id="scriptId"
              margin="dense"
              value={scriptId}
              disabled={disabled}
              onChange={handleScriptChange}>
              {[defaultItem, ...scriptOptions]}
            </Select>
          </FormControl>
          <TextField
            id="entryFunction"
            disabled={disabled}
            InputLabelProps={{ className: classes.label }}
            className={classes.textField}
            value={entryFunction}
            onChange={event =>
              patchEditor({ entryFunction: event.target.value })
            }
            label="Function"
            margin="dense"
          />
          {scriptId && insertStubKey && (
            <Button
              variant="contained"
              color="primary"
              className={classes.textField}
              onClick={handleInsertStubClick}
              disabled={disabled}
              data-test={insertStubKey}>
              {`Insert ${hooksLabelMap[insertStubKey]} stub`}
            </Button>
          )}
        </div>
        <div
          className={classes.scriptPanel}
          key={error || violations ? 'sm' : 'md'}>
          {scriptContent === undefined && scriptId ? (
            <Fragment>
              <Typography>Retrieving your script</Typography>
              <Spinner />
            </Fragment>
          ) : (
            <CodePanel
              name="code"
              readOnly={disabled}
              value={code}
              mode="javascript"
              onChange={handleCodeChange}
            />
          )}
        </div>
      </div>
    </LoadResources>
  );
}
