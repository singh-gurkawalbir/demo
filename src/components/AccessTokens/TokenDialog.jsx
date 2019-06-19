import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import TokenForm from './TokenForm';
import { COMM_STATES } from '../../reducers/comms';
import CommStatus from '../CommStatus';
import * as selectors from '../../reducers';

const mapStateToProps = (state, { integrationId }) => ({
  accessTokens: selectors.accessTokenList(state, integrationId),
});
const mapDispatchToProps = dispatch => ({
  saveAccessToken: data => {
    if (data._id) {
      dispatch(actions.accessToken.update(data));
    } else {
      dispatch(actions.accessToken.create(data));
    }
  },
});

class TokenDialog extends Component {
  state = {
    errorMessage: undefined,
  };
  handleSaveClick(data) {
    const {
      saveAccessToken,
      accessTokens,
      id,
      integrationId,
      connectorId,
    } = this.props;
    const accessTokenData = {
      _id: this.props.id,
      name: data.name,
      description: data.description,
      _connectionIds: data._connectionIds || [],
      _exportIds: data._exportIds || [],
      _importIds: data._importIds || [],
    };

    if (data.scope === 'fullAccess') {
      accessTokenData.fullAccess = true;
      accessTokenData._connectionIds = [];
      accessTokenData._exportIds = [];
      accessTokenData._importIds = [];
    } else {
      accessTokenData.fullAccess = false;
    }

    if (data.autoPurge === 'never') {
      accessTokenData.autoPurgeAt = '';
    } else if (data.autoPurge) {
      const autoPurgeParts = data.autoPurge.split('-');
      const currDate = moment();

      currDate.add(autoPurgeParts[0], autoPurgeParts[1]);
      accessTokenData.autoPurgeAt = currDate.toISOString();
    } else if (id) {
      const existingData = accessTokens.find(at => at._id === id);

      if (existingData.autoPurgeAt) {
        accessTokenData.autoPurgeAt = existingData.autoPurgeAt;
      }
    }

    accessTokenData._integrationId = integrationId;
    accessTokenData._connectorId = connectorId;

    saveAccessToken(accessTokenData);
  }

  render() {
    const { id, integrationId, onCancelClick, successHandler } = this.props;
    const { errorMessage, actionsToClear } = this.state;

    return (
      <Fragment>
        <CommStatus
          actionsToMonitor={{
            createOrUpdate: {
              action: id
                ? actionTypes.ACCESSTOKEN_UPDATE
                : actionTypes.ACCESSTOKEN_CREATE,
              resourceId: id,
              integrationId,
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
                  id
                    ? 'Access token updated successfully'
                    : 'Access token created successfully'
                );
              } else if (
                objStatus.createOrUpdate.status === COMM_STATES.ERROR
              ) {
                stateToUpdate.errorMessage = objStatus.createOrUpdate.message;
              }

              this.setState(stateToUpdate);
            }
          }}
        />

        <Dialog open maxWidth={false}>
          <DialogTitle>{id ? 'Edit API Token' : 'New API Token'}</DialogTitle>
          <DialogContent style={{ width: '30vw' }}>
            <Typography>{errorMessage}</Typography>
            <TokenForm
              id={id}
              integrationId={integrationId}
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
  mapStateToProps,
  mapDispatchToProps
)(TokenDialog);
