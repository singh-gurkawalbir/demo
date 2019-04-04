import { Component } from 'react';
import FormDialog from '../FormDialog';
import CodeEditor from '../../components/CodeEditor';

export default class JsonEditorDialog extends Component {
  state = {
    value: {},
    error: false,
  };

  handleChange(value) {
    this.setState({ value });

    try {
      JSON.parse(value);
      this.setState({ error: false });
    } catch (e) {
      this.setState({ error: true });
    }
  }

  handleSave() {
    const { onChange, onClose } = this.props;
    const { value } = this.state;

    if (typeof onChange === 'function') {
      const json = JSON.parse(value);

      onChange(json);
    }

    onClose();
  }

  componentDidMount() {
    const { value } = this.props;

    this.setState({ value });
  }

  render() {
    const { id, title, onClose } = this.props;
    const { value, error } = this.state;

    return (
      <FormDialog
        isValid={!error}
        onClose={onClose}
        onSubmit={() => this.handleSave()}
        title={title}>
        <CodeEditor
          name={id}
          value={value}
          mode="json"
          onChange={v => this.handleChange(v)}
        />
      </FormDialog>
    );
  }
}
