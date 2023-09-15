import useApp from '@/services/appContext';
import { auth } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

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
            <button
              className="text-white bg-red-500 px-4 py-1 rounded-lg shadow"
              onClick={() => signOut(auth).then(() => onAuthChange(null))}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
