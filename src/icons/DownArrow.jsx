import SvgIcon from '@material-ui/core/SvgIcon';

export default function DownArrow(props) {
  const { className } = props;

  return (
    <SvgIcon className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          className={className}
          d="M4,6.2c-0.4-0.3-0.9-0.3-1.3,0c0,0,0,0,0,0c-0.3,0.4-0.3,0.9,0,1.3l6.6,6.2c0,0,0.1,0.1,0.1,0.1
	C9.7,13.9,9.8,14,10,14c0.2,0,0.3,0,0.5-0.2c0.1,0,0.1-0.1,0.1-0.1l6.6-6.2c0.4-0.3,0.4-0.9,0-1.3c-0.3-0.4-0.9-0.4-1.3,0
	c0,0,0,0,0,0L10.9,11c0,0-0.6,0.6-0.9,0.6c-0.4,0-0.9-0.6-0.9-0.6L4,6.2z"
        />
      </svg>
    </SvgIcon>
  );
}
