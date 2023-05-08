import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  InfoIconButton,
} from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import { useFormOnCancel } from '../../FormOnCancelContext';
import RightDrawer from '../Right';
import SaveAndCloseButtonGroupForm from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../DynaForm';
import TextButton from '../../Buttons/TextButton';
import { ALIAS_FORM_KEY } from '../../../constants';
import actions from '../../../actions';
import InstallationGuideIcon from '../../icons/InstallationGuideIcon';
import CeligoDivider from '../../CeligoDivider';
import getFieldMeta from './CreateAliasFormMeta';
import { message } from '../../../utils/messageStore';
import { drawerPaths, buildDrawerUrl } from '../../../utils/rightDrawer';

const anchorProps = {
  component: 'a',
  target: '_blank',
  href: 'https://docs.celigo.com/hc/en-us/articles/4454740861979',
};

const AliasForm = ({ resourceId, resourceType, isEdit, parentUrl }) => {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const aliasId = match?.params?.aliasId;
  const [remountCount, setRemountCount] = useState(0);
  const [isFormSaveTriggered, setIsFormSaveTriggered] = useState(false);
  const resourceAliases = useSelector(state => selectors.ownAliases(state, resourceType, resourceId));
  const isAliasActionCompleted = useSelector(state => selectors.aliasActionStatus(state, resourceId));
  const savedAliasId = useSelector(state => selectors.savedAliasId(state, resourceId));
  const aliasData = useMemo(() => {
    if (!isEdit) return;

    return resourceAliases.find(ra => ra.alias === aliasId);
  }, [isEdit, aliasId, resourceAliases]);
  const fieldMeta = useMemo(() => getFieldMeta(resourceId, resourceType, aliasData, isEdit), [resourceId, resourceType, aliasData, isEdit]);

  useFormInitWithPermissions({formKey: ALIAS_FORM_KEY[resourceType], fieldMeta, optionsHandler: fieldMeta.optionsHandler, remount: remountCount});

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  useEffect(() => {
    if (!isFormSaveTriggered || !(isAliasActionCompleted === 'save' || isAliasActionCompleted === 'edit')) {
      return;
    }

    // if the alias form is saved
    // we will open the edit alias form of the newly created alias
    if (aliasId !== savedAliasId) {
      history.replace(
        buildDrawerUrl({
          path: drawerPaths.ALIASES.EDIT,
          baseUrl: parentUrl,
          params: { aliasId: savedAliasId },
        })
      );
    }
  }, [history, isFormSaveTriggered, isAliasActionCompleted, savedAliasId, parentUrl, aliasId, handleClose, dispatch]);

  const handleSave = useCallback(closeAfterSave => {
    dispatch(actions.resource.aliases.createOrUpdate(resourceId, resourceType, aliasId, isEdit, ALIAS_FORM_KEY[resourceType]));

    if (closeAfterSave) {
      handleClose();
    }
    setIsFormSaveTriggered(true);
  }, [dispatch, resourceType, resourceId, aliasId, isEdit, handleClose]);

  const remountForm = useCallback(() => {
    setRemountCount(remountCount => remountCount + 1);
  }, []);

  return (
    <>
      <DrawerContent withPadding>
        <DynaForm formKey={ALIAS_FORM_KEY[resourceType]} />
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseButtonGroupForm
          formKey={ALIAS_FORM_KEY[resourceType]}
          onSave={handleSave}
          onClose={handleClose}
          remountAfterSaveFn={remountForm}
        />
      </DrawerFooter>
    </>
  );
};

export default function CreateAliasDrawer({resourceId, resourceType, height = 'short' }) {
  const {disabled, setCancelTriggered} = useFormOnCancel(ALIAS_FORM_KEY[resourceType]);
  const match = useRouteMatch();
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/edit');

  return (
    <RightDrawer
      isIntegrated
      height={height}
      path={[drawerPaths.ALIASES.ADD, drawerPaths.ALIASES.EDIT]} >
      <DrawerHeader >
        <DrawerTitle>
          {isEdit ? 'Edit alias' : 'Create alias'}
          <InfoIconButton
            info={isEdit ? message.ALIAS.EDIT_ALIAS_FORM_HELPINFO : message.ALIAS.CREATE_ALIAS_FORM_HELPINFO}
            title={isEdit ? 'Edit alias' : 'Create alias'}
          />
        </DrawerTitle>
        <TextButton
          {...anchorProps}
          startIcon={<InstallationGuideIcon />}>
          Aliases guide
        </TextButton>
        <CeligoDivider position="right" />
        <DrawerCloseButton disable={disabled} onClick={setCancelTriggered} />
      </DrawerHeader>
      <AliasForm parentUrl={match.url} isEdit={isEdit} resourceId={resourceId} resourceType={resourceType} />
    </RightDrawer>
  );
}
