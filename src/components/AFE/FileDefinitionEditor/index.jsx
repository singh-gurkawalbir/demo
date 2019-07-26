import { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from '../GenericEditor';
import sampleFileDef from './sampleFileDef'

const mapStateToProps = (state, { editorId }) => {
  const editor = selectors.editor(state, editorId);

  return { ...editor };
};

const mapDispatchToProps = (dispatch, { editorId, rule, data }) => ({
  handleRuleChange: rule => {
    dispatch(actions.editor.patch(editorId, { rule }));
  },
  handleDataChange: data => {
    dispatch(actions.editor.patch(editorId, { data }));
  },
  handleInit: () => {
   rule = sampleFileDef
  
    dispatch(
      actions.editor.init(editorId, 'structuredFileParser', {
        rule,
        data,
      })
    );
  },
});

class FileDefinitionEditor extends Component {
  render() {
    const { result, ...other } = this.props;
    const parsedData = result && result.data;

    return (
      <Editor
        result={parsedData}
        {...other}
        processor="structuredFileParser"
        ruleMode="json"
        dataMode="text"
        resultMode="json"
        ruleTitle="File definition rules"
        dataTitle="Available resources"
        resultTitle="Generated export"
      />
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(FileDefinitionEditor);
