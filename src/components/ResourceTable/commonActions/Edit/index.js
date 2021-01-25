import { useCallback, useEffect} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EditIcon from '../../../icons/EditIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';

export default {
  label: (rowData, actionProps) => {
    if (['accesstokens', 'apis', 'connectors'].includes(actionProps.resourceType)) {
      return `Edit ${MODEL_PLURAL_TO_LABEL[actionProps?.resourceType]}`;
    }
    if (actionProps?.resourceType?.indexOf('/licenses') >= 0) {
      if (rowData.type === 'integrationAppChild') {
        return 'Edit child license';
      }

      return 'Edit license';
    }

    return `Edit ${MODEL_PLURAL_TO_LABEL[actionProps?.resourceType]?.toLowerCase()}`;
  },
  icon: EditIcon,
  component: function Edit(props) {
    const { rowData = {} } = props;
    let {resourceType} = props;
    const history = useHistory();
    const match = useRouteMatch();

    if (resourceType?.indexOf('/licenses') >= 0) {
      resourceType = 'connectorLicenses';
    }

    const handleClick = useCallback(() => {
      history.push(`${match.url}/edit/${resourceType}/${rowData._id}`);
    }, [history, match.url, rowData._id, resourceType]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};
