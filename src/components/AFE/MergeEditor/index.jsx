import { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from '../GenericEditor';

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
    const { result, ...other } = this.props;
    const parsedData = result && result.data && result.data[0];

    return (
      <Editor
        result={parsedData}
        {...other}
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
