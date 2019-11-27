import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { KeyValueComponent } from '../../DynaForm/fields/DynaKeyValue';
import getJSONPaths from '../../../utils/jsonPaths';
import { isJsonString } from '../../../utils/string';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflowY: 'auto',
    width: '100%',
    marginTop: theme.spacing(1),
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing(1),
  },
  rowContainer: {
    display: 'flex',
    marginBottom: 6,
  },
}));

export default function TransformPanel(props) {
  const { editorId, keyName = 'extract', valueName = 'generate' } = props;
  const classes = useStyles(props);
  const { data, rule } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const dispatch = useDispatch();
  const patchEditor = value => {
    dispatch(actions.editor.patch(editorId, { rule: value }));
  };

  let parsedData;

  // We are supporting passing of string and json to editor. Check if we want to have a consistency.
  // The change to be made in other editors too
  if (data && typeof data === 'string' && isJsonString(data)) {
    parsedData = JSON.parse(data);
  } else if (data && typeof data === 'object') {
    parsedData = data;
  }

  const dataFields = getJSONPaths(parsedData || {});
  const suggestionConfig = {
    keyConfig: {
      suggestions: dataFields,
      labelName: 'id',
      valueName: 'id',
    },
  };

  return (
    <KeyValueComponent
      {...props}
      suggestionConfig={suggestionConfig}
      dataTest={editorId}
      onUpdate={patchEditor}
      showDelete
      classes={classes}
      value={rule}
      keyName={keyName}
      valueName={valueName}
    />
  );
}
