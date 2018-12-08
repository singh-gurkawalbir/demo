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
  patchEditor: (option, value) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
  },
});

@withStyles(theme => ({
  container: {
    padding: '10px',
    backgroundColor: theme.palette.background.default,
    height: '100%',
  },
  input: {
    flex: 'auto',
  },
}))
class TransformPanel extends Component {
  render() {
    // const { editor, patchEditor, classes } = this.props;
    const { classes } = this.props;
    const rule = [
      { extract: 'a', generate: 'AA' },
      { extract: 'b', generate: 'BB' },
      { extract: 'c', generate: 'CC' },
    ];

    return (
      <div className={classes.container}>
        {rule.map(r => (
          <div key={`${r.extract}-${r.generate}`}>
            <Input
              value={r.extract}
              placeholder="extract"
              className={classes.input}
              inputProps={{
                'aria-label': 'Extract Path',
              }}
            />
            <Input
              value={r.generate}
              placeholder="generate"
              className={classes.input}
              inputProps={{
                'aria-label': 'Generate Path',
              }}
            />
          </div>
        ))}
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(TransformPanel);
