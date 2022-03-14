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
  const aliasId = match.params?.aliasId;
  const isInheritedAlias = match.url?.includes('inherited');
  const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, resourceType, resourceId);
  const inheritedAliases = useSelectorMemo(selectors.makeInheritedAliases, resourceType, resourceId);
  const aliasData = (isInheritedAlias ? inheritedAliases : resourceAliases).find(ra => ra.alias === aliasId) || {};
  const { id: aliasResourceId, resourceType: aliasResourceType } = getResourceFromAlias(aliasData);
  const aliasResource = useSelectorMemo(selectors.makeResourceSelector, aliasResourceType, aliasResourceId) || {};
  const parentResource = useSelectorMemo(selectors.makeResourceSelector, 'integrations', aliasData?.parentResourceId) || {};

  const dataToRender = useMemo(() => {
    const data = {
      'Alias ID': aliasData.alias,
    };

    if (aliasData.description) {
      data['Alias description'] = aliasData.description;
    }
    data['Resource type'] = MODEL_PLURAL_TO_LABEL[aliasResourceType];
    data['Resource Name'] = aliasResource.name;
    data['Resource ID'] = aliasResourceId;

    if (isInheritedAlias) {
      data['Parent resource'] = true;
    }

    return data;
  }, [aliasData, aliasResource, aliasResourceType, aliasResourceId, isInheritedAlias]);

  return (
    <>
      {Object.keys(dataToRender).map(key => (
        <div key={key} className={classes.aliasDetailContent}>
          <Typography component="span" variant="h6" >{`${key}: `}</Typography>
          {(key === 'Parent resource' && parentResource) ? (<NameCell al={{resourceType: 'integration', _resourceId: parentResource._id}} />)
            : (<Typography component="span" >{dataToRender[key]}</Typography>)}
        </div>
      ))}
    </>
  );
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
      path={['viewdetails/inherited/:aliasId', 'viewdetails/:aliasId']}
    >
      <DrawerHeader
        title="View details"
        infoText={infoTextViewAliasDetails}
        handleClose={handleClose} />
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
