import { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from './';

const mapStateToProps = (state, { editorId }) => {
  const editor = selectors.editor(state, editorId);

  return {
    rule: editor.rule,
    data: editor.data,
    result: editor.result ? JSON.stringify(editor.result.data[0], null, 2) : '',
    error: editor.error,
  };
};

const mapDispatchToProps = (dispatch, { editorId, rule, data }) => ({
  handleRuleChange: rule => {
    dispatch(actions.editor.patch(editorId, { rule }));
  },
  handleDataChange: data => {
    dispatch(actions.editor.patch(editorId, { data }));
  },
  handleInit: () => {
    dispatch(
      actions.editor.init(editorId, 'merge', {
        rule,
        data,
      })
    );
  },
  handlePreview: () => {
    dispatch(actions.editor.evaluateRequest(editorId));
  },
});

class MergeEditor extends Component {
  render() {
    const {
      rule,
      data,
      result,
      error,
      editorId,
      layout = 'column',
      handleRuleChange,
      handleDataChange,
      handleInit,
    } = this.props;

    return (
      <Editor
        editorId={editorId}
        processor="merge"
        rule={rule}
        ruleMode="json"
        data={data}
        dataMode="json"
        result={result}
        resultMode="json"
        error={error}
        layout={layout}
        ruleTitle="Default Object"
        dataTitle="Merge Target"
        resultTitle="Final Object"
        handleRuleChange={handleRuleChange}
        handleDataChange={handleDataChange}
        handleInit={handleInit}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MergeEditor);
