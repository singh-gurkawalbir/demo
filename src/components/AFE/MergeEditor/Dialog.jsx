import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import MergeEditor from './';

export default class MergeEditorDialog extends Component {
  render() {
    const defaults = {
      layout: 'column',
      width: '80vw',
      height: '50vh',
      open: true,
    };
    const { id, rule, data, ...other } = this.props;
    const props = Object.assign({}, defaults, other);

    return (
      <EditorDialog id={id} {...props}>
        <MergeEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
