import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import JavaScriptEditor from './';

export default class MergeEditorDialog extends Component {
  render() {
    const defaults = {
      layout: 'compact',
      width: '80vw',
      height: '60vh',
      open: true,
    };
    const { id, rule, data, ...rest } = this.props;

    return (
      <EditorDialog id={id} {...defaults} {...rest} showLayoutOptions={false}>
        <JavaScriptEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
