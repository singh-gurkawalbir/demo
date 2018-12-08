import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import TransformEditor from './';

export default class TransformEditorDialog extends Component {
  render() {
    const { id, rule, data } = this.props;
    const defaults = {
      layout: 'column',
      width: '85vw',
      height: '60vh',
      open: true,
    };
    const dialogProps = Object.assign({}, defaults, this.props);

    // no visible harm in including extra props, but there is a rendering
    // impact. React will re-render the dialog if any prop changes...
    // We dont want to include any props that are not explicitly needed by
    // the component...
    delete dialogProps.rule;
    delete dialogProps.data;

    return (
      <EditorDialog {...dialogProps} showLayoutOptions={false}>
        <TransformEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
