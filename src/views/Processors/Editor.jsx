import { hot } from 'react-hot-loader';
import { Component } from 'react';
import AFE from '../../components/AFE';

@hot(module)
export default class Editor extends Component {
  render() {
    const { id, processor, data, onClose } = this.props;

    return (
      <AFE
        id={id}
        data={data}
        open
        title={`${processor} Editor`}
        processor={processor}
        onClose={onClose}
      />
    );
  }
}
