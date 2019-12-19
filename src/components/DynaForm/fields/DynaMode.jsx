import DynaRadioGroup from './radiogroup/DynaRadioGroup';

export default function DynaMode(props) {
  const { flowId } = props;

  return (flowId && <DynaRadioGroup {...props} />) || null;
}
