import AccessTokenList from '../../components/AccessTokenList';

export default function AccessTokens(props) {
  const { match } = props;
  const { integrationId } = match.params;

  return <AccessTokenList integrationId={integrationId} />;
}
