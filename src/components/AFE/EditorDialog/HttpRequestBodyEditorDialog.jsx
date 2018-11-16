import { Component } from 'react';
import EditorDialog from './';
import HttpRequestBodyEditor from '../Editor/HttpRequestBodyEditor';

export default class UrlEditorDialog extends Component {
  render() {
    const {
      id,
      rule,
      data,
      onClose,
      open = true,
      title,
      width = '88vw',
      height = '60vh',
    } = this.props;

    return (
      <EditorDialog
        id={id}
        open={open}
        title={title}
        width={width}
        height={height}
        onClose={onClose}>
        <HttpRequestBodyEditor id={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
