import { useRouter } from 'next/router';

const useRedirect = () => {
  const router = useRouter();
  return (router.query?.redirect || '/') as string;
};

export default useRedirect;
