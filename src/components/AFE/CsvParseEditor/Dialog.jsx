import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import CsvParseEditor from './';

export default class CsvParseEditorDialog extends Component {
  render() {
    const { id, rule, data, ...rest } = this.props;
    const defaults = {
      width: '80vw',
      height: '50vh',
      open: true,
    };

    return (
      <EditorDialog
        id={id}
        {...defaults}
        {...rest}
        showLayoutOptions={false}
        showFullScreen>
        <CsvParseEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
