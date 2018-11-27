import { connect } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from './';

const mapStateToProps = (state, { editorId }) => ({
  getEditor: () => selectors.editor(state, editorId),
});
const mapDispatchToProps = (dispatch, { editorId, strict, rule, data }) => ({
  handleRuleChange: rule => {
    dispatch(actions.editor.patch(editorId, { template: rule }));
  },
  handleDataChange: data => {
    dispatch(actions.editor.patch(editorId, { data }));
  },
  handleInit: () => {
    dispatch(
      actions.editor.init(editorId, 'handlebars', {
        strict,
        template: rule,
        data,
      })
    );
  },
  handlePreview: () => {
    dispatch(actions.editor.evaluateRequest(editorId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
