import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import UrlEditor from './';

export default class UrlEditorDialog extends Component {
  render() {
    const defaults = {
      open: true,
      width: '70vw',
      height: '50vh',
    };
    const { id, rule, data, ...other } = this.props;
    const props = Object.assign({}, defaults, other);

    return (
      <EditorDialog id={id} {...props} showLayoutOptions={false}>
        <UrlEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
