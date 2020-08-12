import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CeligoTable from '../../../../components/CeligoTable';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import IconTextButton from '../../../../components/IconTextButton';
import metadata from './metadata';
import ArrowLeftIcon from '../../../../components/icons/ArrowLeftIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
};

export default function Invite(props) {
  const { setShowInviteView } = props;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;
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
        helpText:
          'Email address of the person who the integration is transferred to. The receiver needs to be a user with their own integrator.io account and can’t be part of your organization',
      },
      _integrationIds: {
        id: '_integrationIds',
        name: '_integrationIds',
        type: 'multiselect',
        label: 'Integrations to transfer',
        required: true,
        options: [
          {
            items: integrations.map(i => ({ label: i.name, value: i._id })),
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
  return (
    <>
      <IconTextButton
        onClick={backToTransferClick}
        variant="outlined"
        color="secondary">
        <ArrowLeftIcon /> Back to transfers
      </IconTextButton>
      <div>
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
      <DynaForm fieldMeta={fieldMeta} render>
        <DynaSubmit onClick={handleSubmit}>Next</DynaSubmit>
      </DynaForm>
      {!!error && <> {error} </>}
      {response && response.length && (
        <>
          <>
            <CeligoTable
              resourceType="transfers"
              data={response}
              {...metadata}
            />
          </>
          <Button
            data-test="invite"
            variant="outlined"
            color="primary"
            onClick={initiateTransferClick}>
            Initiate Transfer
          </Button>
        </>
      )}
    </>
  );
}
