import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
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

@withStyles(() => ({
  container: {
    // padding: '10px',
    // backgroundColor: theme.palette.background.default,
    // height: '100%',
  },
}))
class CsvParsePanel extends Component {
  render() {
    const { editor, patchEditor } = this.props;
    // const { code = '', entryFunction = '' } = editor;
    const { code = '' } = editor;

    return (
      <CodePanel
        name="code"
        value={code}
        mode="javascript"
        onChange={code => patchEditor('code', code)}
      />
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(CsvParsePanel);
