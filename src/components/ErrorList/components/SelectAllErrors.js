import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import CheckboxUnselectedIcon from '../../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../icons/CheckboxSelectedIcon';
import actions from '../../../actions';
import { isAllErrorsSelected } from '../../../reducers';

export default function SelectAllErrors({ flowId, resourceId, type = 'open' }) {
  const dispatch = useDispatch();
  const isAllSelected = useSelector(state =>
    isAllErrorsSelected(state, {
      flowId,
      resourceId,
      type,
    })
  );
  const handleChange = event => {
    const { checked } = event.target;

    dispatch(
      actions.errorManager.flowErrorDetails.open.selectAll({
        flowId,
        resourceId,
        checked,
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
