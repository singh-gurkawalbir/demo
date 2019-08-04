import { connect } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import * as completers from '../editorSetup/completers';
import Editor from '../SqlQueryEditor';

const mapStateToProps = (state, { editorId }) => {
  const editor = selectors.editor(state, editorId);
  // update directly to the completers
  const jsonData = editor.data;
  const helperFunctions = selectors.editorHelperFunctions(state);

  completers.handleBarsCompleters.setCompleters(jsonData, helperFunctions);

  return {
    rule: editor.template,
    sampleData: editor.sampleData,
    defaultData: editor.defaultData,
    result: editor.result ? editor.result.data : '',
    error: editor.error && editor.error.message,
    violations: editor.violations,
  };
};

const mapDispatchToProps = (
  dispatch,
  { editorId, sampleData, defaultData, strict, rule }
) => ({
  handleRuleChange: rule => {
    dispatch(actions.editor.patch(editorId, { template: rule }));
  },
  handleSampleDataChange: data => {
    dispatch(
      actions.editor.patch(editorId, {
        sampleData: data,
      })
    );
  },
  handleDefaultDataChange: data => {
    dispatch(
      actions.editor.patch(editorId, {
        defaultData: data,
      })
    );
  },
  handleInit: () => {
    dispatch(
      actions.editor.init(editorId, 'handlebars', {
        strict,
        autoEvaluate: true,
        autoEvaluateDelay: 300,
        template: rule,
        defaultData,
        sampleData,
      })
    );
    // get Helper functions when the editor intializes
    dispatch(actions.editor.refreshHelperFunctions());
  },
  handlePreview: () => {
    dispatch(actions.editor.evaluateRequest(editorId));
  },
});

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Editor);
