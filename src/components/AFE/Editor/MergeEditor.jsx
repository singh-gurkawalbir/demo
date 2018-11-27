import { Component } from 'react';
import Editor from './';

export default class MergeEditor extends Component {
  render() {
    const { editorId, layout = 'column' } = this.props;

    return (
      <Editor
        editorId={editorId}
        processor="merge"
        ruleMode="json"
        dataMode="json"
        resultMode="json"
        layout={layout}
        ruleTitle="Default Object"
        dataTitle="Merge Target"
        resultTitle="Final Object"
      />
    );
  }
}
