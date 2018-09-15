import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import LoadingList from '../../components/LoadingList';
import RowDetail from './RowDetail';
import DetailList from '../../components/DetailList';
import actions from '../../actions';
import {
  exportDetails,
  isConnectionsDataReady,
  isExportsDataReady,
  haveExportsData,
  haveConnectionsData,
} from '../../reducers';

const mapStateToProps = state => ({
  isConnectionsDataReady: isConnectionsDataReady(state),
  isExportsDataReady: isExportsDataReady(state),
  haveExportsData: haveExportsData(state),
  haveConnectionsData: haveConnectionsData(state),
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
  async componentDidMount() {
    const {
      haveConnectionsData,
      haveExportsData,
      requestConnections,
      requestExports,
    } = this.props;

    if (!haveConnectionsData) {
      requestConnections();
    }

    if (!haveExportsData) {
      requestExports();
    }
  }

  render() {
    const {
      isConnectionsDataReady,
      isExportsDataReady,
      exportDetails,
    } = this.props;

    if (!isConnectionsDataReady || !isExportsDataReady) {
      const steps = [
        { name: 'Loading Connections', done: isConnectionsDataReady },
        { name: 'Loading Exports', done: isExportsDataReady },
      ];

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
