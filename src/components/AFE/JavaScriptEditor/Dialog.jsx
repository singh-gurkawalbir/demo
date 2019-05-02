import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import JavaScriptEditor from './';

export default class JavaScriptEditorDialog extends Component {
  render() {
    const defaults = {
      width: '80vw',
      height: '60vh',
      open: true,
    };
    const { id, scriptId, entryFunction, data, ...rest } = this.props;

    return (
      <EditorDialog id={id} {...defaults} {...rest} showLayoutOptions={false}>
        <JavaScriptEditor
          editorId={id}
          scriptId={scriptId}
          entryFunction={entryFunction}
          data={data}
        />
      </EditorDialog>
    );
  }
}
