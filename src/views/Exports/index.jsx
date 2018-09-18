import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import RowDetail from './RowDetail';
import DetailList from '../../components/DetailList';
import LoadResources from '../../components/LoadResources';
import { exportDetails } from '../../reducers';

const mapStateToProps = state => ({
  exportDetails: exportDetails(state),
});

@hot(module)
class Exports extends Component {
  render() {
    const { exportDetails } = this.props;

    return (
      <LoadResources required resources={['exports', 'connections']}>
        <DetailList itemName="Exports" rowData={exportDetails}>
          <RowDetail />
        </DetailList>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps)(Exports);
