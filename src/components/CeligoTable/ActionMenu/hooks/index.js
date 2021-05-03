
import React, { useCallback} from 'react';

const useFunctionsFromHookProps = (meta, rowData) => {
  const {
    useOnClick = () => null,
    useHasAccess = () => true,
    useDisabledActionText = () => '',
    useLabel = () => ''} = meta;
  const onClick = useOnClick(rowData);
  const hasAccess = useHasAccess(rowData);
  const disabledActionText = useDisabledActionText(rowData);
  const label = useLabel(rowData);

  return {
    onClick,
    hasAccess,
    disabledActionText,
    label,
  };
};

export const useGetAllActionProps = ({meta, rowData, handleMenuClose}) => {
  const {
    useOnClick,
    useHasAccess,
    useDisabledActionText,
    useLabel,
    Icon,
  } = meta;
  const {
    onClick,
    hasAccess,
    disabledActionText,
    label,
  } = useFunctionsFromHookProps({
    useOnClick,
    useHasAccess,
    useDisabledActionText,
    useLabel,
  }, rowData);

  const handleActionClick = useCallback(() => {
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
    handleMenuClose();
  }, [handleMenuClose, onClick]);

  const disabledActionTitle = disabledActionText;
  const actionIcon = Icon ? <Icon /> : null;

  return {
    handleActionClick,
    actionIcon,
    hasAccess,
    label,
    disabledActionTitle,
  };
};
