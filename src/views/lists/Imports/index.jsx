import { hot } from 'react-hot-loader';
import { Component } from 'react';
import LoadingList from '../../../components/LoadingList';
import RowDetail from './RowDetail';
import DetailList from '../DetailList';

@hot(module)
export default class Exports extends Component {
  buildRowData() {
    const { imports, connections } = this.props;
    const cHash = {};

    // convert conn array to hash keyed from conn id.
    // lets join exports and connection into hybrid obj.
    connections.map(c => (cHash[c._id] = c));

    // build view model for this view.
    const rowData = imports.map(e => {
      const c = cHash[e._connectionId];

      return {
        id: e._id,
        heading: e.name || e._id,
        type: e.type,
        lastModified: e.lastModified,
        searchableText: `${e.id}|${e.name}|${c.name}|${c.assistant}|${c.type}`,
        application: (c.assistant || c.type).toUpperCase(),
        connection: {
          type: c.type,
          id: c._id,
          name: c.name || c._id,
        },
      };
    });

    return rowData;
  }

  render() {
    const { connections, imports } = this.props;
    const steps = [
      { name: 'Loading Connections', done: !!connections },
      { name: 'Loading Imports', done: !!imports },
    ];

    if (!connections || !imports) {
      return <LoadingList steps={steps} />;
    }

    const rowData = this.buildRowData();

    return (
      <DetailList itemName="Imports" rowData={rowData}>
        <RowDetail />
      </DetailList>
    );
  }
}
