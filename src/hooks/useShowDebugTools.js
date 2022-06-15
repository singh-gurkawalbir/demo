
export default function useShowDebugTools() {
  const notProduction = ['staging'].includes(process.env.NODE_ENV);

  return notProduction;
}
