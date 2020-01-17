import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import LoadResources from '../../../components/LoadResources';
import CodePanel from '../GenericEditor/CodePanel';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import { hooksLabelMap, getScriptHookStub } from '../../../utils/hooks';
import CeligoSelect from '../../CeligoSelect';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    height: 100,
  },
  label: {
    paddingLeft: theme.spacing(1),
  },
  editorSettings: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  formFields: {
    height: 80,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    '& > div': {
      minWidth: '140px',
      marginRight: 10,
      '&:first-child': {
        marginLeft: 10,
      },
    },
  },
  CodeEditor: {
    height: '100%',
  },
  select: {
    height: 50,
  },
  loader: {
    padding: theme.spacing(1),
  },
}));

export default function JavaScriptPanel(props) {
  const { editorId, disabled, insertStubKey } = props;
  const classes = useStyles(props);
  const { code = '', entryFunction = '', scriptId = '' } = useSelector(state =>
    selectors.editor(state, editorId)
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
    (option, value) => {
      dispatch(actions.editor.patch(editorId, { [option]: value }));
    },
    [dispatch, editorId]
  );
  const requestScript = useCallback(() => {
    dispatch(actions.resource.request('scripts', scriptId));
  }, [dispatch, scriptId]);
  const handleCodeChange = useCallback(code => patchEditor('code', code), [
    patchEditor,
  ]);
  const handleScriptChange = useCallback(
    event => patchEditor('scriptId', event.target.value),
    [patchEditor]
  );
  const handleInsertStubClick = useCallback(() => {
    // Fetches stub and appends it to current script content
    const updatedScriptContent = code + getScriptHookStub(insertStubKey);

    // Updated this new script content on editor
    patchEditor('code', updatedScriptContent);
  }, [code, insertStubKey, patchEditor]);

  useEffect(() => {
    // TODO: What if for the requested script is non existent...
    // do we have a timeout for the spinner
    if (scriptContent !== undefined) {
      patchEditor('code', scriptContent);
    } else if (scriptId) {
      requestScript();
      // Shouldnt we update to the selected scriptId
    }
  }, [editorId, patchEditor, requestScript, scriptContent, scriptId]);

  return (
    <LoadResources required resources={['scripts']}>
      <div className={classes.editorSettings}>
        <div className={classes.formFields}>
          <FormControl>
            <CeligoSelect
              id="scriptId"
              displayEmpty
              value={scriptId || ''}
              disabled={disabled}
              default
              className={classes.select}
              onChange={handleScriptChange}>
              <MenuItem value="" disabled>
                Script
              </MenuItem>
              {allScripts.map(s => (
                <MenuItem key={s._id} value={s._id}>
                  {s.name}
                </MenuItem>
              ))}
            </CeligoSelect>
          </FormControl>
          <TextField
            id="entryFunction"
            disabled={disabled}
            InputLabelProps={{ className: classes.label }}
            value={entryFunction}
            onChange={event => patchEditor('entryFunction', event.target.value)}
            label="Entry Function"
            variant="filled"
          />
          {scriptId && insertStubKey && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleInsertStubClick}
              disabled={disabled}
              data-test={insertStubKey}>
              {`Insert ${hooksLabelMap[insertStubKey]} Stub`}
            </Button>
          )}
        </div>
        <div className={classes.CodeEditor}>
          {scriptContent === undefined && scriptId ? (
            <div className={classes.loader}>
              <Typography>Retrieving your script</Typography>
              <Spinner />
            </div>
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
