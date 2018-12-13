import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import XmlParseEditor from './';

export default class XmlParseEditorDialog extends Component {
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
        <XmlParseEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
