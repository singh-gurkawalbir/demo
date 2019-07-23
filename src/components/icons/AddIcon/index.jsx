import SvgIcon from '@material-ui/core/SvgIcon';

export default function AddIcon(props) {
  const { className } = props;

  return (
    <SvgIcon className={className}>
      <path
        className={className}
        d="M30.080 15.104h-13.184v-13.184c0-0.512-0.384-0.896-0.896-0.896s-0.896 0.384-0.896 0.896v13.184h-13.184c-0.512 0-0.896 0.384-0.896 0.896s0.384 0.896 0.896 0.896h13.184v13.184c0 0.512 0.384 0.896 0.896 0.896s0.896-0.384 0.896-0.896v-13.056h13.184c0.512 0 0.896-0.384 0.896-0.896s-0.384-1.024-0.896-1.024z"
      />
    </SvgIcon>
  );
}
