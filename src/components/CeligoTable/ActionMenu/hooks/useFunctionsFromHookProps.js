export const useFunctionsFromHookProps = (meta, rowData) => {
  const {
    useOnClick = () => null,
    useHasAccess = () => true,
    useDisabledActionText = () => '',
    useDisabled = () => false,
    useLabel = () => ''} = meta;
  const onClick = useOnClick(rowData);
  const hasAccess = useHasAccess(rowData);
  const disabledActionText = useDisabledActionText(rowData);
  const label = useLabel(rowData);
  const disabled = useDisabled(rowData);

  return {
    onClick,
    hasAccess,
    disabledActionText,
    label,
    disabled,
  };
};
