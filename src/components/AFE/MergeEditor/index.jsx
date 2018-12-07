import { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from '../GenericEditor';

const mapStateToProps = (state, { editorId }) => {
  const editor = selectors.editor(state, editorId);

  return {
    rule: editor.rule,
    data: editor.data,
    result: editor.result ? JSON.stringify(editor.result.data[0], null, 2) : '',
    error: editor.error,
    violations: editor.violations,
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
});

class MergeEditor extends Component {
  render() {
    return (
      <Editor
        {...this.props}
        processor="merge"
        ruleMode="json"
        dataMode="json"
        resultMode="json"
        ruleTitle="Default Object"
        dataTitle="Merge Target"
        resultTitle="Final Object"
      />
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(MergeEditor);
