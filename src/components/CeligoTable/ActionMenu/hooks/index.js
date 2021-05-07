
import React, { useCallback} from 'react';
import { useFunctionsFromHookProps } from './useFunctionsFromHookProps';

export const useGetAllActionProps = ({meta, rowData, handleMenuClose, setSelectedComponent}) => {
  const {
    useOnClick,
    useHasAccess,
    useDisabledActionText,
    useLabel,
    icon: Icon,
    Component,
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
    // onClick triggers either component or onClick
    if (onClick && typeof onClick === 'function') {
      onClick();
    } else if (Component) {
      setSelectedComponent(<Component rowData={rowData} />);
    }
    handleMenuClose();
  }, [Component, handleMenuClose, onClick, rowData, setSelectedComponent]);

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
