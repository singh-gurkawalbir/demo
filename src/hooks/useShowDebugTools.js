
export default function useShowDebugTools() {
  const notProduction = ['development', 'staging'].includes(process.env.NODE_ENV);

  return notProduction;
}
