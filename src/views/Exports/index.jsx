import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import RowDetail from './RowDetail';
import DetailList from '../../components/DetailList';
import RequireResources from '../../components/RequireResources';
import { exportDetails } from '../../reducers';

const mapStateToProps = state => ({
  exportDetails: exportDetails(state),
});

@hot(module)
class Exports extends Component {
  render() {
    const { exportDetails } = this.props;

    return (
      <RequireResources resources={['exports', 'connections']}>
        <DetailList itemName="Exports" rowData={exportDetails}>
          <RowDetail />
        </DetailList>
      </RequireResources>
    );
  }
}

export default connect(mapStateToProps)(Exports);
