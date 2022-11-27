import { useCallback} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EditIcon from '../../../icons/EditIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

export default {
  key: 'edit',
  useLabel: rowData => {
    const tableContext = useGetTableContext();

    if (tableContext.resourceType === 'iClients') {
      return 'Edit iClient';
    }
    if (['accesstokens', 'apis', 'connectors'].includes(tableContext.resourceType)) {
      return `Edit ${MODEL_PLURAL_TO_LABEL[tableContext?.resourceType]}`;
    }
    if (tableContext?.resourceType?.includes('/licenses')) {
      if (rowData.type === 'integrationAppChild') {
        return 'Edit child license';
      }

      return 'Edit license';
    }

    return `Edit ${MODEL_PLURAL_TO_LABEL[tableContext?.resourceType]?.toLowerCase()}`;
  },
  icon: EditIcon,
  useOnClick: rowData => {
    let {resourceType} = useGetTableContext();
    const history = useHistory();
    const match = useRouteMatch();

    if (resourceType?.indexOf('/licenses') >= 0) {
      resourceType = 'connectorLicenses';
    }

    const handleClick = useCallback(() => {
      history.push(buildDrawerUrl({
        path: drawerPaths.RESOURCE.EDIT,
        baseUrl: match.url,
        params: { resourceType, id: rowData._id },
      }));
    }, [history, match.url, rowData._id, resourceType]);

    return handleClick;
  },
};
