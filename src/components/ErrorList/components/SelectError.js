import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import CheckboxUnselectedIcon from '../../icons/CheckboxUnselectedIcon';
import CheckboxSelectedIcon from '../../icons/CheckboxSelectedIcon';
import actions from '../../../actions';
import { isErrorSelected } from '../../../reducers';

export default function SelectError({
  flowId,
  resourceId,
  error,
  type = 'open',
}) {
  const dispatch = useDispatch();
  const isSelected = useSelector(state =>
    isErrorSelected(state, {
      flowId,
      resourceId,
      errorId: error.errorId,
      type,
    })
  );
  const handleChange = event => {
    const { checked } = event.target;

    dispatch(
      actions.errorManager.flowErrorDetails.open.select({
        flowId,
        resourceId,
        errorId: error.errorId,
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
      checked={isSelected}
      color="primary"
    />
  );
}
