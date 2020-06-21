import { useCallback, useEffect} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EditIcon from '../../../icons/EditIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';


export default {
  label: (rowData, actionProps) => {
    if (actionProps.resourceType === 'accesstokens') {
      return 'Edit API token';
    }
    return `Edit ${actionProps && MODEL_PLURAL_TO_LABEL[actionProps.resourceType].toLowerCase()}`;
  },
  icon: EditIcon,
  component: function Edit(props) {
    const { resourceType, rowData = {} } = props;
    const history = useHistory();
    const match = useRouteMatch();

    const handleClick = useCallback(() => {
      history.push(`${match.url}/edit/${resourceType}/${rowData._id}`);
    }, [history, match.url, rowData._id, resourceType]);
    useEffect(() => {
      handleClick();
    }, [handleClick]);


    return null;
  },
};
