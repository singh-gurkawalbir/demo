import { useSelector, useDispatch } from 'react-redux';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import CloseIcon from '../../icons/CloseIcon';

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

  const handleDelete = row => () => {
    const { rule } = editor;

    if (rule[row]) {
      rule.splice(row, 1);
      patchEditor(rule);
    }
  };

  const handleUpdate = (row, event, field) => {
    const { value } = event.target;
    let { rule } = editor;

    if (!rule) rule = [];

    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    if (row !== undefined) {
      rule[row][field] = value;
    } else {
      rule.push({ [field]: value });
    }

    patchEditor(rule);
  };

  const rule = editor.rule
    ? editor.rule.map((rule, index) => ({ row: index, ...rule }))
    : [];
  const handleExtractUpdate = row => event =>
    handleUpdate(row, event, 'extract');
  const handleGenerateUpdate = row => event =>
    handleUpdate(row, event, 'generate');

  return (
    <div className={classes.container}>
      {rule.map(r => (
        <div className={classes.rowContainer} key={r.row}>
          <Input
            autoFocus
            defaultValue={r.extract}
            placeholder="extract"
            className={classes.input}
            onChange={handleExtractUpdate(r.row)}
          />
          <Input
            defaultValue={r.generate}
            placeholder="generate"
            className={classes.input}
            onChange={handleGenerateUpdate(r.row)}
          />
          <IconButton
            data-test="deleteTransformation"
            aria-label="delete"
            onClick={handleDelete(r.row)}
            className={classes.margin}>
            <CloseIcon />
          </IconButton>
        </div>
      ))}
      <div key="new" className={classes.rowContainer}>
        <Input
          value=""
          placeholder="extract"
          className={classes.input}
          onChange={handleExtractUpdate()}
        />
        <Input
          value=""
          placeholder="generate"
          className={classes.input}
          onChange={handleGenerateUpdate()}
        />
        <IconButton
          data-test="deleteTransformation"
          aria-label="delete"
          disabled
          className={classes.margin}>
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
}
