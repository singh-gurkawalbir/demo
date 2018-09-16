import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import RowDetail from './RowDetail';
import DetailList from '../../components/DetailList';
import RequireResources from '../../components/RequireResources';
import { importDetails } from '../../reducers';

const mapStateToProps = state => ({
  importDetails: importDetails(state),
});

@hot(module)
class Imports extends Component {
  render() {
    const { importDetails } = this.props;

    return (
      <RequireResources resources={['imports', 'connections']}>
        <DetailList itemName="Imports" rowData={importDetails}>
          <RowDetail />
        </DetailList>
      </RequireResources>
    );
  }
}

export default connect(mapStateToProps)(Imports);
