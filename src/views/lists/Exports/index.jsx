import { hot } from 'react-hot-loader';
import { Component } from 'react';
import StepList from '../../../components/StepList';
import RowDetail from './RowDetail';
import DetailList from '../DetailList';

@hot(module)
export default class Exports extends Component {
  buildRowData() {
    const { exports, connections } = this.props;
    const cHash = {};

    // convert conn array to hash keyed from conn id.
    // lets join exports and connection into hybrid obj.
    connections.map(c => (cHash[c._id] = c));

    // build view model for this view.
    const rowData = exports.map(e => ({
      id: e._id,
      name: e.name || e._id,
      type: e.type,
      lastModified: e.lastModified,
      app: (
        cHash[e._connectionId].assistant || cHash[e._connectionId].type
      ).toUpperCase(),
      connection: {
        type: cHash[e._connectionId].type,
        id: cHash[e._connectionId]._id,
        name: cHash[e._connectionId].name || cHash[e._connectionId]._id,
      },
    }));

    return rowData;
  }

  render() {
    const { connections, exports } = this.props;
    const steps = [
      { name: 'Loading Connections', done: !!connections },
      { name: 'Loading Exports', done: !!exports },
    ];

    if (!connections || !exports) {
      return <StepList steps={steps} />;
    }

    const rowData = this.buildRowData();

    return (
      <DetailList itemName="Exports" rowData={rowData}>
        <RowDetail />
      </DetailList>
    );
  }
}
