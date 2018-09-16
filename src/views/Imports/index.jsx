import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import RowDetail from './RowDetail';
import DetailList from '../../components/DetailList';
import LoadResources from '../../components/LoadResources';
import { importDetails } from '../../reducers';

const mapStateToProps = state => ({
  importDetails: importDetails(state),
});

@hot(module)
class Imports extends Component {
  render() {
    const { importDetails } = this.props;

    return (
      <LoadResources required resources={['imports', 'connections']}>
        <DetailList itemName="Imports" rowData={importDetails}>
          <RowDetail />
        </DetailList>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps)(Imports);
