import DynaRadioGroup from './DynaRadioGroup';

export default function DynaMode(props) {
  const { flowId } = props;

  return (flowId && <DynaRadioGroup {...props} />) || null;
}
