import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import SwitchOnOff from '../../../../SwitchToggle';
import { confirmDialog } from '../../../../ConfirmDialog';

export default {
  label: 'Off/On',
  component: function EnableOrDisableFlow({ resource }) {
    const dispatch = useDispatch();
    const enableOrDisableFlow = () => {
      const enable = resource.disabled;
      const message = [
        'Are you sure you want to ',
        enable ? 'enable' : 'disable',
        resource.name || resource._id,
        'flow?',
      ].join(' ');

      confirmDialog({
        title: 'Confirm',
        message,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: () => {
              const patchSet = [
                {
                  op: 'replace',
                  path: '/disabled',
                  value: !enable,
                },
              ];

              dispatch(
                actions.resource.patchStaged(resource._id, patchSet, 'value')
              );
              dispatch(
                actions.resource.commitStaged('flows', resource._id, 'value')
              );
            },
          },
        ],
      });
    };

    return (
      <SwitchOnOff on={!resource.disabled} onClick={enableOrDisableFlow} />
    );
  },
};
