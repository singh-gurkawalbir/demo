import { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from '../GenericEditor';

const mapStateToProps = (state, { editorId }) => {
  const editor = selectors.editor(state, editorId);

  return { ...editor };
};

const mapDispatchToProps = (
  dispatch,
  {
    editorId,
    rule = 'function main (form) { return form }',
    entryFunction = 'main',
    data,
  }
) => ({
  handleRuleChange: code => {
    dispatch(actions.editor.patch(editorId, { code }));
  },
  handleDataChange: data => {
    dispatch(actions.editor.patch(editorId, { data }));
  },
  handleInit: () => {
    dispatch(
      actions.editor.init(editorId, 'javascript', {
        code: rule,
        entryFunction,
        data,
      })
    );
  },
});

class JavaScriptEditor extends Component {
  render() {
    const { result, ...rest } = this.props;
    const parsedData = result && result.data && result.data[0];

    return (
      <Editor
        result={parsedData}
        {...rest}
        processor="javascript"
        ruleMode="javascript"
        dataMode="json"
        resultMode="json"
        ruleTitle="Your Script"
        dataTitle="Function Input"
        resultTitle="Function Output"
      />
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(JavaScriptEditor);
