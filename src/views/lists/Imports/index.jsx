import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import LoadingList from '../../../components/LoadingList';
import RowDetail from './RowDetail';
import DetailList from '../DetailList';
import actions from '../../../actions';

const mapStateToProps = state => ({
  session: state.session,
  connections: state.data.connections,
  imports: state.data.imports,
});
const mapDispatchToProps = dispatch => ({
  requestImports: () => {
    dispatch(actions.requestResource('imports'));
  },
  requestConnections: () => {
    dispatch(actions.requestResource('connections'));
  },
});

@hot(module)
class Imports extends Component {
  buildRowData() {
    const { imports, connections } = this.props;
    const cHash = {};

    // convert conn array to hash keyed from conn id.
    // lets join exports and connection into hybrid obj.
    connections.map(c => (cHash[c._id] = c));

    // build view model for this view.
    const rowData = imports.map(e => {
      const c = cHash[e._connectionId] || {};

      // TODO: some imports or exports don't have connections.
      return {
        id: e._id,
        heading: e.name || e._id,
        type: e.type,
        lastModified: e.lastModified,
        searchableText: `${e.id}|${e.name}|${c.name}|${c.assistant}|${c.type}`,
        application: (c.assistant || c.type || '').toUpperCase(),
        connection: {
          type: c.type,
          id: c._id,
          name: c.name || c._id || '',
        },
      };
    });

    return rowData;
  }

  render() {
    const {
      connections,
      imports,
      requestConnections,
      requestImports,
    } = this.props;
    const steps = [
      { name: 'Loading Connections', done: !!connections },
      { name: 'Loading Imports', done: !!imports },
    ];

    if (!connections || !imports) {
      if (!connections) {
        requestConnections();
      }

      if (!imports) {
        requestImports();
      }

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

export default connect(mapStateToProps, mapDispatchToProps)(Imports);
