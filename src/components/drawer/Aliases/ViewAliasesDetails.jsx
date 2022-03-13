import { Typography } from '@material-ui/core';
import React, { useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import { getResourceFromAlias, MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import FilledButton from '../../Buttons/FilledButton';
import NameCell from '../../ResourceTable/commonCells/Name';
import RightDrawer from '../Right';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import DrawerHeader from '../Right/DrawerHeader';

const ViewAliasDetails = ({ resourceId, resourceType }) => {
  const match = useRouteMatch();
  const aliasId = match.params?.aliasId;
  const allAliases = useSelectorMemo(selectors.makeAllAliases, resourceType, resourceId);
  const aliasData = allAliases?.find(ra => ra.alias === aliasId);
  const { id: aliasResourceId, resourceType: aliasResourceType } = getResourceFromAlias(aliasData);
  const aliasResource = useSelectorMemo(selectors.makeResourceSelector, aliasResourceType, aliasResourceId) || {};
  const parentResource = useSelectorMemo(selectors.makeResourceSelector, 'integrations', aliasData.parentResourceId);

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

    if (parentResource) {
      data['Parent resource'] = true;
    }

    return data;
  }, [aliasData, aliasResource, aliasResourceType, aliasResourceId, parentResource]);

  return (
    <>
      {Object.keys(dataToRender).map(key => (
        <div key={key}>
          <Typography component="span" variant="h6" >{`${key}: `}</Typography>
          {(key === 'Parent resource' && parentResource) ? (<NameCell al={{resourceType: 'integration', _resourceId: parentResource._id}} />)
            : (<Typography component="span" >{dataToRender[key]}</Typography>)}
        </div>
      ))}
    </>
  );
};

export default function ViewAliasDetailsDrawer({ resourceId, resourceType }) {
  const history = useHistory();

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const infoTextViewAliasDetails = '';

  return (
    <RightDrawer
      height="short"
      width="default"
      path={['viewdetails/:aliasId']}
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
