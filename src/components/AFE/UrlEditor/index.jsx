import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Editor from '../HandlebarsEditor';

@withStyles(() => ({
  gridTemplate: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1fr 2fr 0fr',
    gridTemplateAreas: '"rule" "result" "data" "error"',
  },
}))
export default class UrlEditor extends Component {
  render() {
    const { editorId, classes, rule, data } = this.props;

    return (
      <Editor
        editorId={editorId}
        rule={rule}
        data={data}
        templateClassName={classes.gridTemplate}
        ruleMode="handlebars"
        dataMode="json"
        resultMode="text"
        ruleTitle="Url Template"
        dataTitle="Sample Data"
        resultTitle="Evaluated Result"
        showFullScreen={false}
        showLayoutOptions={false}
        enableAutocomplete
      />
    );
  }
}
