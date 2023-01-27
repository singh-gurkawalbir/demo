import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import rfdc from 'rfdc';
import CeligoTable from '../../../../components/CeligoTable';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import metadata from './metadata';
import ArrowLeftIcon from '../../../../components/icons/ArrowLeftIcon';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import FilledButton from '../../../../components/Buttons/FilledButton';
import OutlinedButton from '../../../../components/Buttons/OutlinedButton';

const clone = rfdc({proto: true});

const useStyles = makeStyles(theme => ({
  infoTransfers: {
    margin: theme.spacing(1, 0),
  },
  createTransferContainer: {
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.divider,
    padding: theme.spacing(2),
  },
  submitBtn: {
    marginTop: theme.spacing(2),
  },
  initiateTransferWrapper: {
    marginTop: theme.spacing(2),
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.divider,
  },
  initiateTransferBtn: {
    margin: theme.spacing(2, 0, 2, 2),
  },
}));
const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
};

export default function Invite(props) {
  const classes = useStyles();
  const { setShowInviteView } = props;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources?.filter(res => !res._parentId); // filter the child integrations
  const clearPreview = useCallback(() => {
    dispatch(actions.transfer.clearPreview());
  }, [dispatch]);

  useEffect(() => {
    clearPreview();
  }, [clearPreview]);
  const data = useSelector(
    state => selectors.getTransferPreviewData(state),
    (left, right) =>
      (left &&
        right &&
        (left.response &&
          right.response &&
          left.response.length === right.response.length)) ||
      (left.error && right.error && left.error === right.error)
  );
  const response = data && data.response;
  const error = data && data.error;
  const fieldMeta = {
    fieldMap: {
      email: {
        id: 'email',
        name: 'email',
        type: 'text',
        label: "New owner's email",
        required: true,
        helpKey: 'transfer.email',
      },
      _integrationIds: {
        id: '_integrationIds',
        name: '_integrationIds',
        type: 'refreshcollection',
        label: 'Integrations to transfer',
        resourceType: 'integrations',
        required: true,
        helpKey: 'transfer._integrationIds',
        options: [
          {
            items: integrations.map(i => ({ label: i.name, value: i._id, tag: i.tag })),
          },
        ],
      },
    },
    layout: {
      fields: ['email', '_integrationIds'],
    },
  };
  const handleSubmit = formVal => {
    setFormData(formVal);
    dispatch(actions.transfer.preview(formVal));
  };

  const initiateTransferClick = () => {
    dispatch(actions.transfer.create(formData));
    setShowInviteView(false);
  };

  const backToTransferClick = () => {
    setShowInviteView(false);
  };

  // TODO: Ashok, There is  no description in the new mock please check.

  const formKey = useFormInitWithPermissions({ fieldMeta, remount: integrations.length });

  return (
    <>
      <div className={classes.createTransferContainer}>
        <OutlinedButton
          onClick={backToTransferClick}
          color="secondary"
          startIcon={<ArrowLeftIcon />}>
          Back to transfers
        </OutlinedButton>
        <div className={classes.infoTransfers}>
          Important! As part of the transfer process, all your currently
          in-progress flows will be allowed to complete, and new flows will not be
          started. If there are any webhook based flows, then they will stop
          accepting new data until the transfer is complete. Once the in-progress
          flows have finished processing, all the flows will be transferred to the
          new user. Jobs and related retry data will not be transferred, and this
          information will be lost for any in-progress jobs that have errors. If
          you are concerned about this data loss then please first disable the
          flows manually, and then retry/resolve all open errors, and then
          initiate the transfer process again.
        </div>
        <DynaForm formKey={formKey} />
        <DynaSubmit formKey={formKey} onClick={handleSubmit}>Next</DynaSubmit>

        {!!error && <div className={classes.infoTransfers}> {error} </div>}
      </div>
      {response && response.length && (
        <div className={classes.initiateTransferWrapper}>
          <CeligoTable resourceType="transfers" data={clone(response)} {...metadata} />
          <FilledButton
            data-test="invite"
            className={classes.initiateTransferBtn}
            onClick={initiateTransferClick}>
            Initiate Transfer
          </FilledButton>
        </div>
      )}
    </>
  );
}
