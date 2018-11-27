import { Component } from 'react';
import HandlebarsEditor from './HandlebarsEditor';

export default class HttpRequestBodyEditor extends Component {
  render() {
    const { editorId, contentType, layout = 'row', rule, data } = this.props;
    const mode = contentType || 'json';

    return (
      <HandlebarsEditor
        editorId={editorId}
        rule={rule}
        data={data}
        strict={false}
        ruleMode="handlebars"
        dataMode="json"
        layout={layout}
        resultMode={mode}
        ruleTitle={`HTTP Body Template (${mode})`}
        dataTitle="Data"
        resultTitle="Final HTTP Body"
      />
    );
  }
}
