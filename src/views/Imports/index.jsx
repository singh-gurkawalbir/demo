import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import LoadingList from '../../components/LoadingList';
import RowDetail from './RowDetail';
import DetailList from '../../components/DetailList';
import actions from '../../actions';
import { importDetails } from '../../reducers';

const mapStateToProps = state => ({
  connections: state.data.connections,
  imports: state.data.imports,
  importDetails: importDetails(state),
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
  render() {
    const {
      connections,
      imports,
      importDetails,
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

    return (
      <DetailList itemName="Imports" rowData={importDetails}>
        <RowDetail />
      </DetailList>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Imports);
