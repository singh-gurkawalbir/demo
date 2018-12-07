import { Component } from 'react';
import EditorDialog from '../EditorDialog';
import CsvParseEditor from './';

export default class CsvParseEditorDialog extends Component {
  render() {
    const { id, rule, data } = this.props;
    const defaults = {
      layout: 'column',
      width: '80vw',
      height: '50vh',
      open: true,
    };
    const dialogProps = Object.assign({}, defaults, this.props);

    return (
      <EditorDialog {...dialogProps} showLayoutOptions={false} showFullScreen>
        <CsvParseEditor editorId={id} rule={rule} data={data} />
      </EditorDialog>
    );
  }
}
