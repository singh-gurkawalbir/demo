import React, { useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import { getResourceFromAlias, MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import FilledButton from '../../Buttons/FilledButton';
import NameCell from '../../ResourceTable/commonCells/Name';
import RightDrawer from '../Right';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import DrawerHeader from '../Right/DrawerHeader';

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
  const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, aliasContextResourceType, aliasContextResourceId);
  const aliasData = resourceAliases.find(ra => ra.alias === aliasId) || {};
  const { id: aliasResourceId, resourceType: aliasResourceType } = getResourceFromAlias(aliasData);
  const aliasResource = useSelectorMemo(selectors.makeResourceSelector, aliasResourceType, aliasResourceId) || {};

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

  const infoTextViewAliasDetails = 'View information about the alias and the resource it references';

  return (
    <RightDrawer
      height={height}
      width="default"
      path={['viewdetails/:aliasId/inherited/:parentResourceId', 'viewdetails/:aliasId']}
    >
      <DrawerHeader
        title="View details"
        infoText={infoTextViewAliasDetails}
      />
      <DrawerContent>
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
