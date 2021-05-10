export const useFunctionsFromHookProps = (meta, rowData) => {
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
