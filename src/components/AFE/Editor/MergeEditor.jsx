import { Component } from 'react';
import Editor from './';

export default class MergeEditor extends Component {
  render() {
    const { id, rule, data, layout = 'column' } = this.props;

    return (
      <Editor
        id={id}
        processor="merge"
        rule={rule}
        data={data}
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
