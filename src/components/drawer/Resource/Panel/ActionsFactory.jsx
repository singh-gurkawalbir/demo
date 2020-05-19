import { ButtonGroup, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import resourceConstants from '../../../../forms/constants/connection';
import { getResourceSubType } from '../../../../utils/resource';
import consolidatedActions from '../../../ResourceFormFactory/Actions';
import * as selectors from '../../../../reducers';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  return type;
};

const useStylesButtons = makeStyles(theme => ({
  actions: {
    padding: theme.spacing(2, 0),
  },
}));

export const GenerateActions = ({ actions, actionProps }) => {
  const classes = useStylesButtons();

  if (!actions) return null;

  const actionButtons =
    actions.length > 0 &&
    actions.map(action => {
      const Action = consolidatedActions[action.id];

      return <Action key={action.id} {...actionProps} {...action} />;
    });

  return (
    <ButtonGroup className={classes.actionButtons}>{actionButtons}</ButtonGroup>
  );
};

export default function ActionsFactory(props) {
  const classes = useStylesButtons();
  const { resourceType, resourceId, isNew } = props;
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  ).merged;
  const connectionType = getConnectionType(resource);
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );

  if (!formState.initComplete) return null;
  const { actions } = formState.fieldMeta;

  // console.log('render: <ActionsFactory>');

  // When action buttons is provided in the metadata then we generate the action buttons for you
  if (actions) {
    return <GenerateActions actions={actions} actionProps={props} />;
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
    <ButtonGroup className={classes.actionButtons}>
      {actionButtons.map(key => {
        const Action = consolidatedActions[key];
        // remove form disabled prop...
        // they dont necessary apply to action button

        return <Action key={key} dataTest={key} {...props} />;
      })}
    </ButtonGroup>
  );
}
