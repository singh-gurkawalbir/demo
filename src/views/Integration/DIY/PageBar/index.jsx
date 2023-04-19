import { MenuItem, Select } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import {EditableText} from '@celigo/fuse-ui';
import actions from '../../../../actions';
import ActionGroup from '../../../../components/ActionGroup';
import { TextButton } from '../../../../components/Buttons';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import ChipInput from '../../../../components/ChipInput';
import AddIcon from '../../../../components/icons/AddIcon';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import CopyIcon from '../../../../components/icons/CopyIcon';
import TrashIcon from '../../../../components/icons/TrashIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import { getIntegrationAppUrlName } from '../../../../utils/integrationApps';
import getRoutePath from '../../../../utils/routePaths';
import { camelCase } from '../../../../utils/string';
import useHandleDelete from '../../hooks/useHandleDelete';
import { useAvailableTabs } from '../useAvailableTabs';
import LoadResources from '../../../../components/LoadResources';
import { emptyList } from '../../../../constants';

const integrationsFilterConfig = { type: 'integrations' };
const useStyles = makeStyles(theme => ({
  tag: {
    marginLeft: theme.spacing(1),
  },
}));

const emptyObj = {};

export default function PageBar() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const availableTabs = useAvailableTabs();
  const { integrationId, childId, tab} = match?.params;

  const {
    name,
    description,
    childDisplayName,
    isIntegrationApp,
    hasIntegration,
    supportsChild,
    tag,
  } = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration) {
      return {
        hasIntegration: true,
        templateId: integration._templateId,
        mode: integration.mode,
        name: integration.name,
        childDisplayName: integration.childDisplayName,
        isIntegrationApp: !!integration._connectorId,
        description: integration.description,
        sandbox: integration.sandbox,
        installSteps: integration.installSteps,
        uninstallSteps: integration.uninstallSteps,
        supportsChild: integration.initChild?.function,
        tag: integration.tag,
      };
    }

    return emptyObj;
  }, shallowEqual);

  const isIntegrationAppV2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  const children = useSelectorMemo(selectors.mkIntegrationTreeChildren, integrationId);
  const resourcesToLoad = isIntegrationAppV2 ? 'tree/metadata' : emptyList;

  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;

  const pageTitle = name || 'Standalone flows';

  const { canEdit, canClone, canDelete } = useSelector(state => {
    const permission = selectors.resourcePermissions(
      state,
      'integrations',
      integrationId
    );

    return {
      canEdit: permission.edit,
      canClone: permission.clone,
      canDelete: permission.delete,
    };
  }, shallowEqual);

  const patchIntegration = useCallback(
    (path, value) => {
      // TODO: need to revisit after IA2.0 behavior is clear.
      // Potential change to switch to PATCH call (instead of PUT)
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchAndCommitStaged('integrations', integrationId, patchSet));
    },
    [dispatch, integrationId]
  );

  const handleTitleChange = useCallback(
    title => {
      patchIntegration('/name', title);
    },
    [patchIntegration]
  );
  const handleAddNewChild = useCallback(() => {
    dispatch(actions.integrationApp.installer.initChild(integrationId));
  }, [integrationId, dispatch]);

  const handleDelete = useHandleDelete(integrationId);

  const handleChildChange = useCallback(
    e => {
      const newChildId = e.target.value;
      let newTab = tab;
      const childIntegration = integrations.find(i => i._id === newChildId);

      if (childIntegration) {
        if (childIntegration.mode === 'install') {
          return history.push(
            getRoutePath(
              `integrationapps/${getIntegrationAppUrlName(childIntegration.name)}/${childIntegration._id}/setup`
            )
          );
        } if (childIntegration.mode === 'uninstall') {
          return history.push(
            getRoutePath(
              `integrationapps/${getIntegrationAppUrlName(childIntegration.name)}/${childIntegration._id}/uninstall`
            )
          );
        }
      }

      if (!availableTabs.find(t => t.path === tab)) {
        newTab = availableTabs[0].path;
      }

      // Redirect to current tab of new child
      history.push(
        getRoutePath(
          `integrationapps/${getIntegrationAppUrlName(name)}/${integrationId}/child/${newChildId}/${newTab}`
        )
      );
    },
    [availableTabs, history, name, integrationId, tab, integrations]
  );
  const handleDescriptionChange = useCallback(
    description => {
      patchIntegration('/description', description);
    },
    [patchIntegration]
  );
  const handleTagChangeHandler = useCallback(
    tag => {
      patchIntegration('/tag', tag);
    },
    [patchIntegration]
  );

  // TODO: <ResourceDrawer> Can be further optimized to take advantage

  // of the 'useRouteMatch' hook now available in react-router-dom to break
  // the need for parent components passing any props at all.
  return (
    <CeligoPageBar
      title={
              (hasIntegration && !isIntegrationApp) ? (
                <EditableText
                  text={name}
                  placeholder="Unnamed integration: Click to add name"
                  disabled={!canEdit}
                  onChange={handleTitleChange}
                />
              ) : (
                pageTitle
              )
            }
      titleTag={isIntegrationApp && (
        <ChipInput
          disabled={!canEdit}
          value={tag || 'tag'}
          className={classes.tag}
          variant="outlined"
          onChange={handleTagChangeHandler}
        />
      )}
      infoTitleName={pageTitle}
      infoText={
              hasIntegration ? (
                <EditableText
                  multiline
                  allowOverflow
                  text={description}
                  placeholder="Click to add a description"
                  onChange={handleDescriptionChange}
                />
              ) : (
                undefined
              )
            }>

      <ActionGroup>
        {canClone && hasIntegration && (
        <TextButton
          component={Link}
          to={getRoutePath(`/clone/integrations/${integrationId}/preview`)}
          startIcon={<CopyIcon />}
          data-test="cloneIntegration">
          Clone integration
        </TextButton>
        )}
        {/* Sravan needs to move add child functionality to integrationApps */}
        { supportsChild && (
        <>
          <TextButton
            onClick={handleAddNewChild}
            startIcon={<AddIcon />}
            data-test="addNewStore">
            {`Add new ${camelCase(childDisplayName) || 'child'}`}
          </TextButton>
          <LoadResources integrationId={integrationId} required resources={resourcesToLoad}>
            <Select
              variant="standard"
              displayEmpty
              data-test="select Child"
              className={classes.storeSelect}
              onChange={handleChildChange}
              IconComponent={ArrowDownIcon}
              value={childId}>
              <MenuItem disabled value="">
                {`Select ${camelCase(childDisplayName) || 'child'}`}
              </MenuItem>

              {children.map(s => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </LoadResources>
        </>
        )}

        {canDelete && hasIntegration && !isIntegrationApp && (
        <TextButton
          startIcon={<TrashIcon />}
          data-test="deleteIntegration"
          onClick={handleDelete}>
          Delete integration
        </TextButton>
        )}
      </ActionGroup>
    </CeligoPageBar>
  );
}

