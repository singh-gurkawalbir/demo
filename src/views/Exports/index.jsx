import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import LoadingList from '../../components/LoadingList';
import RowDetail from './RowDetail';
import DetailList from '../../components/DetailList';
import actions from '../../actions';
import { exportDetails } from '../../reducers';

const mapStateToProps = state => ({
  connections: state.data.connections,
  exports: state.data.exports,
  exportDetails: exportDetails(state),
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
  render() {
    const {
      connections,
      exports,
      exportDetails,
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

    return (
      <DetailList itemName="Exports" rowData={exportDetails}>
        <RowDetail />
      </DetailList>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Exports);
