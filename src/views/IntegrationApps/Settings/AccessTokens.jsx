import AccessTokenList from '../../AccessTokenList';

export default function AccessTokens(props) {
  const { integrationId } = props;

  return <AccessTokenList integrationId={integrationId} {...props} />;
}
