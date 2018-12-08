import { Component } from 'react';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
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
  handleUpdate(row, value, field) {
    const { patchEditor, editor } = this.props;
    const { rule = [] } = editor;

    console.log(`"${row}"`, value, field);

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
      ? editor.rule.map((r, n) => ({ ...r, row: n }))
      : [];

    console.log(rule);

    const handleExtractUpdate = row => event =>
      this.handleUpdate(row, event.target.value, 'extract');
    const handleGenerateUpdate = row => event =>
      this.handleUpdate(row, event.target.value, 'generate');

    return (
      <div className={classes.container}>
        {rule.map(r => (
          <div className={classes.rowContainer} key={r.row}>
            <Input
              defaultValue={r.extract}
              placeholder="extract"
              className={classes.input}
              onBlur={handleExtractUpdate(r.row)}
            />
            <Input
              defaultValue={r.generate}
              placeholder="generate"
              className={classes.input}
              onBlur={handleGenerateUpdate(r.row)}
            />
          </div>
        ))}
        <div className={classes.rowContainer}>
          <Input
            defaultValue=""
            placeholder="extract"
            className={classes.input}
            onBlur={handleExtractUpdate()}
          />
          <Input
            defaultValue=""
            placeholder="generate"
            className={classes.input}
            onBlur={handleGenerateUpdate()}
          />
        </div>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(TransformPanel);
