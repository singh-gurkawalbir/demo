import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import TransformEditor from './';

export default class TransformEditorDialog extends Component {
  render() {
    const { id, rule, data, ...other } = this.props;
    const defaults = {
      layout: 'column',
      width: '85vw',
      height: '60vh',
      open: true,
    };
    const dialogProps = Object.assign({}, defaults, other);

    return (
      <EditorDialog {...dialogProps} showLayoutOptions={false}>
        <TransformEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
