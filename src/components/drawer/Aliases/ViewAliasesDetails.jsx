import React, { useCallback, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  InfoIconButton,
  FilledButton,
} from '@celigo/fuse-ui';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import { getResourceFromAlias, MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import NameCell from '../../ResourceTable/commonCells/Name';
import RightDrawer from '../Right';
import { emptyObject } from '../../../constants';
import { drawerPaths } from '../../../utils/rightDrawer';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  aliasDetailContent: {
    marginBottom: theme.spacing(2),
  },
}));

const ViewAliasDetails = ({ resourceId, resourceType }) => {
  const classes = useStyles();
  const match = useRouteMatch();
  const { aliasId, parentResourceId} = match.params;
  const isInheritedAlias = match.url?.includes('inherited');
  // If the alias is inherited, then the resource context level at which
  // the alias is defined will always be integration
  const aliasContextResourceType = isInheritedAlias ? 'integrations' : resourceType;
  const aliasContextResourceId = isInheritedAlias ? parentResourceId : resourceId;
  const aliasData = useSelector(state => {
    const resourceAliases = selectors.ownAliases(state, aliasContextResourceType, aliasContextResourceId);

    return resourceAliases.find(ra => ra.alias === aliasId) || emptyObject;
  }, shallowEqual);

  const { id: aliasResourceId, resourceType: aliasResourceType } = getResourceFromAlias(aliasData);
  const aliasResource = useSelectorMemo(selectors.makeResourceSelector, aliasResourceType, aliasResourceId) || emptyObject;

  const dataToRender = useMemo(() => ({
    'Alias ID': aliasData.alias,
    'Alias description': aliasData.description,
    'Resource type': MODEL_PLURAL_TO_LABEL[aliasResourceType],
    'Resource name': aliasResource.name,
    'Resource ID': aliasResourceId,
    'Parent resource': parentResourceId,
  }), [aliasData, aliasResource, aliasResourceType, aliasResourceId, parentResourceId]);

  return Object.keys(dataToRender).map(key => (
    <div key={key} className={classes.aliasDetailContent}>
      {dataToRender[key] ? (
        <>
          <Typography component="span" variant="h6" >{`${key}: `}</Typography>
          <Typography component="span" >{key !== 'Parent resource' ? dataToRender[key] : ''}</Typography>
          <NameCell al={{resourceType: 'integration', _resourceId: key === 'Parent resource' ? parentResourceId : ''}} />
        </>
      ) : ''}
    </div>
  ));
};

export default function ViewAliasDetailsDrawer({ resourceId, resourceType, height = 'short' }) {
  const history = useHistory();

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <RightDrawer
      isIntegrated
      height={height}
      path={[drawerPaths.ALIASES.VIEW_INHERITED_DETAILS, drawerPaths.ALIASES.VIEW_DETAILS]}
    >
      <DrawerHeader>
        <DrawerTitle>
          View details
          <InfoIconButton
            title="View details"
            info={message.ALIAS.VIEW_DETAILS_HELPINFO}
          />
        </DrawerTitle>
        <DrawerCloseButton onClick={handleClose} />
      </DrawerHeader>
      <DrawerContent withPadding>
        <ViewAliasDetails resourceId={resourceId} resourceType={resourceType} />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="closeLogs"
          onClick={handleClose}>
          Close
        </FilledButton>
      </DrawerFooter>
    </RightDrawer>
  );
}
