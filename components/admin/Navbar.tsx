import useApp from '@/services/appContext';
import { auth } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
const Navbar = ({ name }: { name: string }) => {
  const { onAuthChange } = useApp();

  return (
    <>
      <div className="h-14"></div>
      <div className="flex items-center justify-center w-full h-14 bg-white shadow-md fixed top-0 z-10">
        <div className="max-w-7xl w-full mx-6 justify-between flex">
          <Link href={'/'} >
            <h1 className="text-2xl font-bold">{name}</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant= "destructive"
              className=" px-2 py-2 rounded"
              onClick={() => signOut(auth).then(() => onAuthChange(null))}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
