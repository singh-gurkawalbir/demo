import Toggle from 'react-toggle';
import 'react-toggle/style.css';

export default function CeligoSwitch({
  enabled = false,
  disabled,
  onChange,
  ...props
}) {
  return (
    <Toggle
      {...props}
      disabled={disabled}
      onChange={onChange}
      checked={enabled}
    />
  );
}
