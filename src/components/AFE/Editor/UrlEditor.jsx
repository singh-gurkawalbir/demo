import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Editor from './HandlebarsEditor';

@withStyles(() => ({
  gridTemplate: {
    gridTemplateColumns: '2fr 1fr',
    gridTemplateRows: '2fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "result data" "error error"',
  },
}))
export default class UrlEditor extends Component {
  render() {
    const { editorId, classes } = this.props;

    return (
      <Editor
        editorId={editorId}
        templateClassName={classes.gridTemplate}
        ruleMode="handlebars"
        dataMode="json"
        resultMode="text"
        ruleTitle="Url Template"
        dataTitle="Sample Data"
        resultTitle="Evaluated Result"
        showFullScreen={false}
        showLayoutOptions={false}
      />
    );
  }
}
