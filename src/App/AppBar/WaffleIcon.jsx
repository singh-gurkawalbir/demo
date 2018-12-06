import SvgIcon from '@material-ui/core/SvgIcon';

export default function WaffleIcon(props) {
  const { className } = props;

  return (
    <SvgIcon className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
        <rect width="6" height="6" />
        <rect width="6" height="6" transform="translate(0 7.5)" />
        <rect width="6" height="6" transform="translate(0 15)" />
        <rect width="6" height="6" transform="translate(7.5)" />
        <rect width="6" height="6" transform="translate(7.5 7.5)" />
        <rect width="6" height="6" transform="translate(7.5 15)" />
        <rect width="6" height="6" transform="translate(15)" />
        <rect width="6" height="6" transform="translate(15 7.5)" />
        <rect width="6" height="6" transform="translate(15 15)" />
      </svg>
    </SvgIcon>
  );
}
