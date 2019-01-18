import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import ExportFilterEditor from './';

export default class ExportFilterEditorDialog extends Component {
  render() {
    const { id, rule, data, ...other } = this.props;
    const defaults = {
      width: '80vw',
      height: '70vh',
      open: true,
    };
    const dialogProps = Object.assign({}, defaults, other);

    return (
      <EditorDialog
        id={id}
        {...dialogProps}
        showLayoutOptions={false}
        showFullScreen>
        <ExportFilterEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
