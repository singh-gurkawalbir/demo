import { Component } from 'react';
import EditorDialog from './';
import CsvParseEditor from '../Editor/CsvParseEditor';

export default class CsvParseEditorDialog extends Component {
  render() {
    const {
      id,
      rule,
      data,
      onClose,
      open = true,
      title,
      layout = 'column',
      width = '80vw',
      height = '50vh',
    } = this.props;

    return (
      <EditorDialog
        id={id}
        open={open}
        showLayoutOptions={false}
        showFullScreen={false}
        layout={layout}
        title={title}
        width={width}
        height={height}
        onClose={onClose}>
        <CsvParseEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
