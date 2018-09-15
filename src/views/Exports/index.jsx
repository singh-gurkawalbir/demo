import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import LoadingList from '../../components/LoadingList';
import RowDetail from './RowDetail';
import DetailList from '../../components/DetailList';
import actions from '../../actions';

const mapStateToProps = state => ({
  session: state.session,
  connections: state.data.connections,
  exports: state.data.exports,
});
const mapDispatchToProps = dispatch => ({
  requestExports: () => {
    dispatch(actions.requestResource('exports'));
  },
  requestConnections: () => {
    dispatch(actions.requestResource('connections'));
  },
});

@hot(module)
class Exports extends Component {
  buildRowData() {
    const { exports, connections } = this.props;
    const cHash = {};

    // convert conn array to hash keyed from conn id.
    // lets join exports and connection into hybrid obj.
    connections.map(c => (cHash[c._id] = c));

    // build view model for this view.
    const rowData = exports.map(e => {
      const c = cHash[e._connectionId];

      return {
        id: e._id,
        heading: (e.name || e._id) + (e.type ? ` (${e.type} export)` : ''),
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
    const {
      connections,
      exports,
      requestConnections,
      requestExports,
    } = this.props;
    const steps = [
      { name: 'Loading Connections', done: !!connections },
      { name: 'Loading Exports', done: !!exports },
    ];

    if (!connections || !exports) {
      if (!connections) {
        requestConnections();
      }

      if (!exports) {
        requestExports();
      }

      return <LoadingList steps={steps} />;
    }

    const rowData = this.buildRowData();

    return (
      <DetailList itemName="Exports" rowData={rowData}>
        <RowDetail />
      </DetailList>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Exports);
