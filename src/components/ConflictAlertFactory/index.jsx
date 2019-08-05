import { connect } from 'react-redux';
import ConflictAlertDialog from '../../views/Resources/ConflictAlertDialog';
import resourceConstants from '../../forms/constants/connection';
import actions from '../../actions';

const mapDispatchToProps = (dispatch, { resourceType, id, scope }) => ({
  handleCommitAndAuthorizeOAuth: () => {
    dispatch(actions.resource.connections.commitAndAuthorize(id));
    dispatch(actions.resource.clearConflict(id, scope));
  },
  handleConflict: skipCommit => {
    if (!skipCommit) {
      dispatch(actions.resource.commitStaged(resourceType, id, scope));
    }

    dispatch(actions.resource.clearConflict(id, scope));
  },
});
const ConflictAlertFactory = props => {
  const {
    handleConflict,
    handleCommitAndAuthorizeOAuth,
    conflict,
    connectionType,
  } = props;
  let handleCommit = () => handleConflict(false);

  if (resourceConstants.OAUTH_APPLICATIONS.includes(connectionType))
    handleCommit = () => handleCommitAndAuthorizeOAuth();

  return (
    <ConflictAlertDialog
      conflict={conflict}
      handleCommit={handleCommit}
      handleCancel={() => handleConflict(true)}
    />
  );
};

export default connect(
  null,
  mapDispatchToProps
)(ConflictAlertFactory);
