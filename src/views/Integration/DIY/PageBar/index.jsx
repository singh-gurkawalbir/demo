import { makeStyles, MenuItem, Select } from '@material-ui/core';
import React, { useCallback, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import ChipInput from '../../../../components/ChipInput';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import EditableText from '../../../../components/EditableText';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import CopyIcon from '../../../../components/icons/CopyIcon';
import TrashIcon from '../../../../components/icons/TrashIcon';
import IconTextButton from '../../../../components/IconTextButton';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import { HOME_PAGE_PATH, STANDALONE_INTEGRATION } from '../../../../utils/constants';
import { getIntegrationAppUrlName } from '../../../../utils/integrationApps';
import { INTEGRATION_DELETE_VALIDATE } from '../../../../utils/messageStore';
import getRoutePath from '../../../../utils/routePaths';
import { useAvailableTabs } from '../useAvailableTabs';

const integrationsFilterConfig = { type: 'integrations' };
const useStyles = makeStyles(theme => ({
  tag: {
    marginLeft: theme.spacing(1),
  },
  editableTextInput: {
    width: `calc(60vw - ${52 + 24}px)`,
  },
  editableTextInputShift: {
    width: `calc(60vw - ${theme.drawerWidth + 24}px)`,
  },
}));

const emptyObj = {};

export default function PageBar() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const availableTabs = useAvailableTabs();
  const { integrationId, childId, tab} = match?.params;

  const {
    name,
    description,
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

  const children = useSelectorMemo(selectors.mkIntegrationChildren, integrationId);

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
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  const flowsFilterConfig = useMemo(
    () => ({
      type: 'flows',
      filter: {
        _integrationId:
              integrationId === STANDALONE_INTEGRATION.id
                ? undefined
                : integrationId,
      },
    }),
    [integrationId]
  );
  const flows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const cantDelete = flows.length > 0;
  const patchIntegration = useCallback(
    (path, value) => {
      // TODO: need to revisit after IA2.0 behavior is clear.
      // Potential change to switch to PATCH call (instead of PUT)
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(integrationId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged('integrations', integrationId, 'value')
      );
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
  const [isDeleting, setIsDeleting] = useState(false);

  if (!hasIntegration && isDeleting) {
    ['integrations', 'tiles', 'scripts'].forEach(resource =>
      dispatch(actions.resource.requestCollection(resource))
    );

    setIsDeleting(false);
    history.push(getRoutePath(HOME_PAGE_PATH));
  }

  const handleDelete = useCallback(() => {
    if (cantDelete) {
      enqueueSnackbar({
        message: INTEGRATION_DELETE_VALIDATE,
        variant: 'info',
      });

      return;
    }
    confirmDialog({
      title: 'Confirm delete',
      message: 'Are you sure you want to delete this integration?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            dispatch(actions.resource.delete('integrations', integrationId));
            setIsDeleting(true);
          },
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [
    cantDelete,
    confirmDialog,
    dispatch,
    enqueueSnackbar,
    integrationId,
  ]);
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
                  disabled={!canEdit}
                  defaultText="Unnamed integration: Click to add name"
                  onChange={handleTitleChange}
                  inputClassName={
                    drawerOpened
                      ? classes.editableTextInputShift
                      : classes.editableTextInput
                  }
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
      infoText={
              hasIntegration ? (
                <EditableText
                  multiline
                  allowOverflow
                  text={description}
                  defaultText="Click to add a description"
                  onChange={handleDescriptionChange}
                />
              ) : (
                undefined
              )
            }>
      {canClone && hasIntegration && (
      <IconTextButton
        component={Link}
        to={getRoutePath(`/clone/integrations/${integrationId}/preview`)}
        variant="text"
        data-test="cloneIntegration">
        <CopyIcon /> Clone integration
      </IconTextButton>
      )}
      {/* Sravan needs to move add child functionality to integrationApps */}
      { supportsChild && (
      <>
        <IconTextButton
          onClick={handleAddNewChild}
          variant="text"
          data-test="addNewStore">
          <CopyIcon /> Add new child
        </IconTextButton>
        <Select
          displayEmpty
          data-test="select Child"
          className={classes.storeSelect}
          onChange={handleChildChange}
          IconComponent={ArrowDownIcon}
          value={childId}>
          <MenuItem disabled value="">
            Select child
          </MenuItem>

          {children.map(s => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      </>
      )}

      {canDelete && hasIntegration && !isIntegrationApp && (
      <IconTextButton
        variant="text"
        data-test="deleteIntegration"
        onClick={handleDelete}>
        <TrashIcon /> Delete integration
      </IconTextButton>
      )}
    </CeligoPageBar>
  );
}

