import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { KeyValueComponent } from '../../DynaForm/fields/DynaKeyValue';
import getJSONPaths from '../../../utils/jsonPaths';

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

  const dataFields = getJSONPaths(data || {});
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
