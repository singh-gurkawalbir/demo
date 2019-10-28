import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { KeyValueComponent } from '../../DynaForm/fields/DynaKeyValue';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflowY: 'auto',
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing(1),
  },
  rowContainer: {
    display: 'flex',
  },
}));

export default function TransformPanel(props) {
  const { editorId } = props;
  const classes = useStyles(props);
  const editor = useSelector(state => selectors.editor(state, editorId));
  const dispatch = useDispatch();
  const patchEditor = value => {
    dispatch(actions.editor.patch(editorId, { rule: value }));
  };

  return (
    <KeyValueComponent
      {...props}
      dataTest={editorId}
      onUpdate={patchEditor}
      showDelete
      classes={classes}
      value={editor.rule}
      keyName="extract"
      valueName="generate"
    />
  );
}
