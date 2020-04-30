import { useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import CheckboxUnselectedIcon from '../../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../icons/CheckboxSelectedIcon';
import actions from '../../../actions';

export default function SelectError({ flowId, resourceId, error }) {
  const dispatch = useDispatch();
  const handleChange = event => {
    const { checked } = event.target;

    dispatch(
      actions.errorManager.flowErrorDetails.selectErrors({
        flowId,
        resourceId,
        errorIds: [error.errorId],
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
      checked={error.selected || false}
      color="primary"
    />
  );
}
