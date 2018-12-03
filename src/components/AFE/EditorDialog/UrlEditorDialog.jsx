import { Component } from 'react';
import EditorDialog from './';
import UrlEditor from '../Editor/UrlEditor';

export default class UrlEditorDialog extends Component {
  render() {
    const {
      id,
      rule,
      data,
      onClose,
      open = true,
      title,
      width = '70vw',
      height = '50vh',
    } = this.props;

    return (
      <EditorDialog
        id={id}
        open={open}
        title={title}
        width={width}
        height={height}
        onClose={onClose}
        showLayoutOptions={false}>
        <UrlEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
