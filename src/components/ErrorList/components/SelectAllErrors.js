import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import CheckboxUnselectedIcon from '../../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../icons/CheckboxSelectedIcon';
import actions from '../../../actions';
import { isAllErrorsSelected, filter, resourceErrors } from '../../../reducers';

export default function SelectAllErrors({
  flowId,
  resourceId,
  type = 'open',
  filterKey,
  defaultFilter,
}) {
  const dispatch = useDispatch();
  const errorIds = useSelector(state => {
    const errorFilter = filter(state, filterKey) || defaultFilter;
    const { errors = [] } = resourceErrors(state, {
      flowId,
      resourceId,
      options: { ...errorFilter },
    });

    return errors.map(error => error.errorId);
  }, shallowEqual);
  const isAllSelected = useSelector(state =>
    isAllErrorsSelected(state, {
      flowId,
      resourceId,
      type,
      errorIds,
    })
  );
  const handleChange = event => {
    const { checked } = event.target;

    dispatch(
      actions.errorManager.flowErrorDetails.selectAll({
        flowId,
        resourceId,
        checked,
        errorIds,
      })
    );
  };

  return (
    <Checkbox
      icon={
        <span>
          <CheckboxUnselectedIcon />
        </span>
      }
      checkedIcon={
        <span>
          <CheckboxSelectedIcon />
        </span>
      }
      onChange={event => handleChange(event)}
      checked={isAllSelected}
      color="primary"
    />
  );
}
