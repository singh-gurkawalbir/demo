import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';

function General(props) {
  const { match } = props;
  const { integrationId } = match.params;
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const fieldMeta = {
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name:',
        defaultValue: integration && integration.name,
      },
      {
        id: 'description',
        name: 'description',
        type: 'text',
        label: 'Description:',
        defaultValue: integration && integration.description,
      },
      {
        id: 'readme',
        name: 'readme',
        type: 'textarea',
        label: 'ReadMe:',
        defaultValue: integration && integration.readme,
      },
    ],
  };
  const handleSubmit = formVal => {
    const patchSet = [
      {
        op: 'replace',
        path: '/name',
        value: formVal.name,
      },
      {
        op: 'replace',
        path: '/description',
        value: formVal.description,
      },
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
    <DynaForm fieldMeta={fieldMeta}>
      <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
    </DynaForm>
  );
}

export default General;
