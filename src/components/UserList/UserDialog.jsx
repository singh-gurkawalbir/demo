import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../utils/constants';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import UserForm from './UserForm';
import { COMM_STATES } from '../../reducers/comms';
import CommStatus from '../CommStatus';

const mapDispatchToProps = dispatch => ({
  saveUser: data => {
    if (data._id) {
      dispatch(actions.user.org.users.update(data._id, data));
    } else {
      dispatch(actions.user.org.users.create(data));
    }
  },
});

class UserDialog extends Component {
  state = {
    errorMessage: undefined,
  };
  handleSaveClick(data) {
    const { saveUser } = this.props;
    const { email, accessLevel } = data;
    const aShareData = {
      _id: this.props.id,
      email,
      accessLevel,
      integrationAccessLevel: [],
    };

    if (accessLevel === USER_ACCESS_LEVELS.TILE) {
      aShareData.accessLevel = undefined;
      data.integrationsToManage.forEach(_integrationId =>
        aShareData.integrationAccessLevel.push({
          _integrationId,
          accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
        })
      );
      data.integrationsToMonitor.forEach(_integrationId => {
        if (!data.integrationsToManage.includes(_integrationId)) {
          aShareData.integrationAccessLevel.push({
            _integrationId,
            accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
          });
        }
      });
    }

    saveUser(aShareData);
  }

  render() {
    const { id, onCancelClick, successHandler } = this.props;
    const { errorMessage, actionsToClear } = this.state;

    return (
      <Fragment>
        <CommStatus
          actionsToMonitor={{
            createOrUpdate: {
              action: id ? actionTypes.USER_UPDATE : actionTypes.USER_CREATE,
              resourceId: id,
            },
          }}
          actionsToClear={actionsToClear}
          commStatusHandler={objStatus => {
            if (
              objStatus &&
              objStatus.createOrUpdate &&
              [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(
                objStatus.createOrUpdate.status
              )
            ) {
              const stateToUpdate = {};

              if (objStatus.createOrUpdate.status === COMM_STATES.SUCCESS) {
                successHandler(
                  id ? 'User updated successfully' : 'User invited successfully'
                );
              } else if (
                objStatus.createOrUpdate.status === COMM_STATES.ERROR
              ) {
                stateToUpdate.errorMessage = objStatus.createOrUpdate.message;
              }

              stateToUpdate.actionsToClear = ['createOrUpdate'];
              this.setState(stateToUpdate);
            }
          }}
        />

        <Dialog open maxWidth={false}>
          <DialogTitle>
            {id ? 'Change User Permissions' : 'Invite User'}
          </DialogTitle>
          <DialogContent style={{ width: '30vw' }}>
            <Typography>{errorMessage}</Typography>
            <UserForm
              id={id}
              onSaveClick={data => {
                this.handleSaveClick(data);
              }}
              onCancelClick={() => {
                onCancelClick();
              }}
            />
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(UserDialog);
