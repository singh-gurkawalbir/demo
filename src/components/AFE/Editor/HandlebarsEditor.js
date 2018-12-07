import { connect } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from './';

const mapStateToProps = (state, { editorId }) => {
  const editor = selectors.editor(state, editorId);

  return {
    rule: editor.template,
    data: editor.data,
    result: editor.result ? editor.result.data : '',
    error: editor.error && editor.error.message,
    violations: editor.violations,
  };
};

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
        autoEvaluate: true,
        autoEvaluateDelay: 300,
        template: rule,
        data,
      })
    );
  },
  handlePreview: () => {
    dispatch(actions.editor.evaluateRequest(editorId));
  },
});

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Editor);
