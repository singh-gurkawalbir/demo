import { Component } from 'react';
import Editor from './';

export default class Handlebars extends Component {
  render() {
    const { id, rule, data, contentType } = this.props;
    const mode = contentType || 'json';

    return (
      <Editor
        id={id}
        processor="handlebars"
        rule={rule}
        data={data}
        ruleMode="handlebars"
        dataMode="json"
        layout="row"
        resultMode={mode}
        ruleTitle={`HTTP Body Template (${mode})`}
        dataTitle="Data"
        resultTitle="Body"
      />
    );
  }
}
