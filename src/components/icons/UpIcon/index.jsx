import SvgIcon from '@material-ui/core/SvgIcon';

export default function UpIcon(props) {
  const { className } = props;

  return (
    <SvgIcon className={className}>
      <path
        className={className}
        d="M1.92 21.888c-0.256 0-0.512-0.128-0.64-0.256-0.384-0.384-0.256-0.896 0.128-1.28l13.952-12.032c0.384-0.256 0.896-0.256 1.152 0l13.952 12.032c0.384 0.384 0.384 0.896 0.128 1.28-0.384 0.384-0.896 0.384-1.28 0.128l-13.44-11.52-13.312 11.52c-0.256 0.128-0.384 0.128-0.64 0.128z"
      />
    </SvgIcon>
  );
}
