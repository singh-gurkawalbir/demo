import { Component } from 'react';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
// import { deepClone } from 'fast-json-patch';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, { editorId }) => ({
  editor: selectors.editor(state, editorId),
});
const mapDispatchToProps = (dispatch, { editorId }) => ({
  patchEditor: value => {
    dispatch(actions.editor.patch(editorId, { rule: value }));
  },
});

@withStyles(theme => ({
  container: {
    paddingLeft: theme.spacing.unit,
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflowY: 'auto',
  },
  input: {
    flex: '1 1 auto',
    marginRight: theme.spacing.unit,
  },
  rowContainer: {
    display: 'flex',
  },
}))
class TransformPanel extends Component {
  handleUpdate(row, event, field) {
    const { value } = event.target;
    const { patchEditor, editor } = this.props;
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
  }

  render() {
    const { editor, classes } = this.props;
    const rule = editor.rule
      ? editor.rule.map((rule, index) => ({ row: index, ...rule }))
      : [];
    const handleExtractUpdate = row => event =>
      this.handleUpdate(row, event, 'extract');
    const handleGenerateUpdate = row => event =>
      this.handleUpdate(row, event, 'generate');

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
        </div>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(TransformPanel);
