import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { TextButton } from '@celigo/fuse-ui';
import AddIcon from '../../../../../../components/icons/AddIcon';
import { drawerPaths, buildDrawerUrl } from '../../../../../../utils/rightDrawer';

export default function CategoryMappingActions() {
  const history = useHistory();
  const match = useRouteMatch();
  const handleAddCategoryClick = () => {
    history.push(buildDrawerUrl({
      path: drawerPaths.MAPPINGS.CATEGORY_MAPPING.ADD,
      baseUrl: match.url,
    }));
  };

  return (
    <TextButton
      startIcon={<AddIcon />}
      data-test="addCategory"
      onClick={handleAddCategoryClick}
      sx={{
        padding: '4px 10px',
        mr: 0.5,
        color: 'secondary.light',
      }}>
      Add category
      {/* TODO:Sravan we need to add the help for add category and variation mapping */}
    </TextButton>
  );
}
