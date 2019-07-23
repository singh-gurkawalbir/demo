import SvgIcon from '@material-ui/core/SvgIcon';

export default function ArrowLeftIcon(props) {
  const { className } = props;

  return (
    <SvgIcon className={className}>
      <path
        className={className}
        d="M22.144 30.976c-0.256 0-0.512-0.128-0.64-0.256l-12.16-14.080c-0.256-0.384-0.256-0.896 0-1.152l12.16-14.080c0.384-0.384 0.896-0.384 1.28-0.128 0.384 0.384 0.384 0.896 0.128 1.28l-11.648 13.44 11.648 13.44c0.384 0.384 0.256 0.896-0.128 1.28-0.128 0.256-0.384 0.256-0.64 0.256z"
      />
    </SvgIcon>
  );
}
