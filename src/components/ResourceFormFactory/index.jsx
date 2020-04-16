import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Typography } from '@material-ui/core';
import actions from '../../actions';
import * as selectors from '../../reducers';
import resourceConstants from '../../forms/constants/connection';
import formFactory from '../../forms/formFactory';
import DynaForm from '../DynaForm';
import consolidatedActions from './Actions';
import { getResourceSubType } from '../../utils/resource';

const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  return type;
};

export function ActionsFactory({ variant = 'edit', ...props }) {
  const { resource, resourceType, isNew } = props;
  const { actions } = props.fieldMeta;
  const connectionType = getConnectionType(resource);

  // console.log('render: <ActionsFactory>');

  if (variant === 'view') {
    return <DynaForm {...props} />;
  }

  // When action buttons is provided in the metadata then we generate the action buttons for you
  if (actions) {
    const ActionButtons =
      actions.length > 0 &&
      actions.map(action => {
        const Action = consolidatedActions[action.id];

        return <Action key={action.id} {...props} {...action} />;
      });

    return <DynaForm {...props}>{ActionButtons}</DynaForm>;
  }

  let actionButtons;

  // When action button metadata isn't provided we infer the action buttons.
  if (resourceType === 'connections' && !isNew) {
    if (resourceConstants.OAUTH_APPLICATIONS.includes(connectionType)) {
      actionButtons = ['oauth', 'cancel'];
    } else {
      actionButtons = ['test', 'testandsave', 'cancel'];
    }
  } else {
    actionButtons = ['save', 'cancel'];
  }

  return (
    <DynaForm {...props}>
      {actionButtons.map(key => {
        const Action = consolidatedActions[key];
        // remove form disabled prop...
        // they dont necessary apply to action button
        const { disabled, ...rest } = props;

        return <Action key={key} dataTest={key} {...rest} />;
      })}
    </DynaForm>
  );
}

export const FormStateManager = ({ formState, onSubmitComplete, ...props }) => {
  const { fieldMeta } = props;
  // once the form successfully completes submission (could be async)
  // we call the parents callback so it can perform some action.

  // TODO: This handler fired every render when i include the
  // onSubmitComplete fn as a dependency... how do i solve this
  // the right way? linter fails if i dont add it...

  // eslint-disable-next-line padding-line-between-statements
  const [count, setCount] = useState(0);
  const remountForm = useCallback(() => setCount(count => count + 1), []);

  useEffect(() => {
    if (formState.submitComplete && onSubmitComplete) {
      onSubmitComplete('', false, formState.formValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.submitComplete /* , onSubmitComplete */]);

  useEffect(() => {
    remountForm();
  }, [fieldMeta, remountForm]);

  if (!formState.initComplete) {
    return <Typography>Initializing Form</Typography>;
  }

  return (
    <ActionsFactory
      onCancel={remountForm}
      {...props}
      {...formState}
      key={count}
    />
  );
};

export const ResourceFormFactory = props => {
  const { resourceType, resourceId, isNew, flowId } = props;
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );
  const resource = useSelector(
    state => selectors.resourceData(state, resourceType, resourceId).merged,
    shallowEqual
  );
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', resource && resource._connectionId)
  );
  const dispatch = useDispatch();
  const handleInitForm = useCallback(
    (resourceType, resourceId, isNew, flowId) => {
      const skipCommit =
        isNew &&
        [
          'imports',
          'exports',
          'connections',
          'pageGenerator',
          'pageProcessor',
        ].includes(resourceType);

      dispatch(
        actions.resourceForm.init(
          resourceType,
          resourceId,
          isNew,
          skipCommit,
          flowId
        )
      );
    },
    [dispatch]
  );
  const handleClearResourceForm = useCallback(
    (resourceType, resourceId) => {
      dispatch(actions.resourceForm.clear(resourceType, resourceId));
    },
    [dispatch]
  );

  useEffect(() => {
    handleInitForm(resourceType, resourceId, isNew, flowId);

    return () => handleClearResourceForm(resourceType, resourceId);
  }, [
    flowId,
    handleClearResourceForm,
    handleInitForm,
    isNew,
    resourceId,
    resourceType,
  ]);

  const { optionsHandler, validationHandler } = useMemo(
    () =>
      formFactory.getResourceFormAssets({
        resourceType,
        resource,
        isNew,
        connection,
      }),
    [connection, isNew, resource, resourceType]
  );
  const { fieldMeta } = formState;

  return (
    <FormStateManager
      {...props}
      resource={resource}
      formState={formState}
      fieldMeta={fieldMeta}
      optionsHandler={optionsHandler}
      validationHandler={validationHandler}
    />
  );
};

export default ResourceFormFactory;
