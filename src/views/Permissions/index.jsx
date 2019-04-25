import { Component } from 'react';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import * as selectors from '../../reducers';

const mapStateToProps = state => ({
  permissions: selectors.userPermissions(state),
});

class Permissions extends Component {
  render() {
    const { permissions } = this.props;

    return (
      <ReactJson
        theme="google"
        collapsed={1}
        displayDataTypes={false}
        src={permissions}
      />
    );
  }
}

export default connect(mapStateToProps)(Permissions);
