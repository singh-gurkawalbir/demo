import { Component } from 'react';
import EditorDialog from './';
import MergeEditor from '../Editor/MergeEditor';

export default class MergeEditorDialog extends Component {
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
        layout={layout}
        title={title}
        width={width}
        height={height}
        onClose={onClose}>
        <MergeEditor id={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
