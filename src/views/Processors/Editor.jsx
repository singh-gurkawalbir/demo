import { hot } from 'react-hot-loader';
import { Component } from 'react';
import AFE from '../../components/AFE';

@hot(module)
export default class Editor extends Component {
  handleClose = () => {
    this.props.history.goBack();
  };

  render() {
    const { name } = this.props.match.params;

    return (
      <AFE
        id={`${name}`}
        open
        title={`${name} Editor`}
        processor={name}
        onEditorClose={this.handleClose}
      />
    );
  }
}
