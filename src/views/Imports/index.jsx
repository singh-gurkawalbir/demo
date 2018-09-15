import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import LoadingList from '../../components/LoadingList';
import RowDetail from './RowDetail';
import DetailList from '../../components/DetailList';
import actions from '../../actions';
import {
  importDetails,
  isConnectionsDataReady,
  isImportsDataReady,
  haveImportsData,
  haveConnectionsData,
} from '../../reducers';

const mapStateToProps = state => ({
  isConnectionsDataReady: isConnectionsDataReady(state),
  isImportsDataReady: isImportsDataReady(state),
  haveImportsData: haveImportsData(state),
  haveConnectionsData: haveConnectionsData(state),
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
  async componentDidMount() {
    const {
      haveConnectionsData,
      haveImportsData,
      requestConnections,
      requestImports,
    } = this.props;

    if (!haveConnectionsData) {
      requestConnections();
    }

    if (!haveImportsData) {
      requestImports();
    }
  }

  render() {
    const {
      isConnectionsDataReady,
      isImportsDataReady,
      importDetails,
    } = this.props;

    if (!isConnectionsDataReady || !isImportsDataReady) {
      const steps = [
        { name: 'Loading Connections', done: isConnectionsDataReady },
        { name: 'Loading Imports', done: isImportsDataReady },
      ];

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
