import { useSelector, useDispatch } from 'react-redux';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CeligoTable from '../../../../components/CeligoTable';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import IconTextButton from '../../../../components/IconTextButton';
import metadata from './metadata';

export default function Invite(props) {
  const { setShowInviteView } = props;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const integrations = useSelector(state =>
    selectors.resourceList(state, {
      type: 'integrations',
    })
  ).resources;
  const clearPreview = useCallback(() => {
    dispatch(actions.transfer.clearPreview());
  }, [dispatch]);

  useEffect(() => {
    clearPreview();
  }, [clearPreview]);
  const data = useSelector(state => selectors.getPreviewData(state));
  const response = data && data.response;
  const error = data && data.error;
  const fieldMeta = {
    fieldMap: {
      email: {
        id: 'email',
        name: 'email',
        type: 'text',
        label: "New Owner's Email:",
        required: true,
      },
      _integrationIds: {
        id: '_integrationIds',
        name: '_integrationIds',
        type: 'multiselect',
        label: 'Next Data Flow:',
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

  return (
    <Fragment>
      <IconTextButton onClick={backToTransferClick}>
        Back to Transfers
      </IconTextButton>
      <DynaForm fieldMeta={fieldMeta} render>
        <DynaSubmit onClick={handleSubmit}>Next</DynaSubmit>
      </DynaForm>
      {!!error && <Fragment> {error} </Fragment>}
      {response && response.length && (
        <Fragment>
          <Fragment>
            <CeligoTable
              resourceType="transfers"
              data={response}
              {...metadata}
            />
          </Fragment>
          <Button
            data-test="invite"
            variant="outlined"
            color="primary"
            onClick={initiateTransferClick}>
            Initiate Transfer
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
}
