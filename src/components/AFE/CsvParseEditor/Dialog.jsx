import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import CsvParseEditor from './';

export default class CsvParseEditorDialog extends Component {
  render() {
    const { id, rule, data, ...other } = this.props;
    const defaults = {
      width: '80vw',
      height: '50vh',
      open: true,
    };
    const dialogProps = Object.assign({}, defaults, other);

    return (
      <EditorDialog
        id={id}
        {...dialogProps}
        showLayoutOptions={false}
        showFullScreen>
        <CsvParseEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
