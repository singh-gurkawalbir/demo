import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import PanelHeader from '../../PanelHeader';

export default function ReadmeSection({ integrationId }) {
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const fieldMeta = {
    fieldMap: {
      readme: {
        id: 'readme',
        name: 'readme',
        type: 'editor',
        mode: 'html',
        label: 'ReadMe',
        defaultValue: integration && integration.readme,
      },
    },
    layout: {
      fields: ['readme'],
    },
  };
  const handleSubmit = formVal => {
    const patchSet = [
      {
        op: 'replace',
        path: '/readme',
        value: formVal.readme,
      },
    ];

    dispatch(actions.resource.patchStaged(integrationId, patchSet, 'value'));
    dispatch(
      actions.resource.commitStaged('integrations', integrationId, 'value')
    );
  };

  return (
    <Fragment>
      <PanelHeader title="Readme" />

      <DynaForm fieldMeta={fieldMeta} render>
        <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
      </DynaForm>
    </Fragment>
  );
}
