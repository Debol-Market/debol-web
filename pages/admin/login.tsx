import Spinner from '@/components/Spinner';
import useApp from '@/services/appContext';
import { login, signInWithGoogle } from '@/services/auth';
import { auth } from '@/services/firebase';
import { getRedirectResult, signOut } from 'firebase/auth';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

const Page = () => {
  const { user, onAuthChange, isAdmin } = useApp();
  const router = useRouter();
  const [authErr, setAuthErr] = useState('');

  const googleLogin = () => {
    try {
      signInWithGoogle()
        .then(() => getRedirectResult(auth))
        .then((result) => onAuthChange(result.user))
        .then(() => { if (isAdmin) router.push('/admin') });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col bg-slate-300">
      <div className="max-w-sm w-full shadow-xl rounded-2xl bg-white py-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold">Login</h1>
        <button
          onClick={googleLogin}
          className="bg-slate-50 hover:bg-slate-100 flex items-center gap-3 w-full py-3 px-4 rounded-lg shadow-md mt-3 max-w-[240px]"
        >
          <FcGoogle size={24} />
          Login in with Google
        </button>
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={(values) => {
            const errors = { email: '', password: '' };
            if (!values.email) {
              errors.email = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }
          }}
          onSubmit={(values, { setSubmitting }) => {
            setAuthErr('');
            login(values.email, values.password)
              .then(async (userCred) => {
                await onAuthChange(userCred.user);
                const { claims } = await userCred.user.getIdTokenResult();
                if (
                  !(
                    Object.keys(claims).includes('role') &&
                    claims?.role == 'admin'
                  )
                ) {
                  await signOut(auth);
                  throw new Error('Incorrect Email or Password');
                }
                router.push('/');
                setSubmitting(false);
              })
              .catch((err) => {
                if (err.code === 'auth/user-not-found') {
                  setAuthErr('Incorrect Email or Password');
                } else if (err.code === 'auth/wrong-password') {
                  setAuthErr('Incorrect Email or Password');
                } else if (err.code === 'auth/network-request-failed') {
                  setAuthErr(
                    'Cannot connect. Check your internet and try again.'
                  );
                } else {
                  setAuthErr(err.message);
                }
              })
              .finally(() => {
                setTimeout(() => {
                  setSubmitting(false);
                }, 300);
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
              <label
                className="text-lg text-slate-500 mt-2 font-semibold"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                onBlur={handleBlur}
                value={values.email}
                onChange={handleChange}
                className={`py-3 px-4 focus:outline-none border-2 border-slate-400 focus:border-blue rounded-lg ${errors.email ? 'border-red-600' : ''
                  } w-auto min-w-0`}
              />
              <p className="text-xs text-red-600 ">
                {errors.email && touched.email && errors.email}
              </p>
              <label
                className="text-lg text-slate-500 mt-2 font-semibold"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                onBlur={handleBlur}
                value={values.password}
                onChange={handleChange}
                className={`py-3 px-4 focus:outline-none border-2 border-slate-400 focus:border-blue rounded-lg ${errors.password ? 'border-red-600' : ''
                  } w-auto min-w-0`}
              />
              <p className="text-xs text-red-600 ">
                {errors.password && touched.password && errors.password}
              </p>
              <button
                type="submit"
                disabled={isSubmitting || !values.email || !values.password}
                className="bg-blue rounded-lg text-white font-semibold mt-1 disabled:bg-blue/70 shadow-md disabled:shadow-none text-xl px-4 py-1 flex items-center justify-center "
              >
                {isSubmitting ? (
                  <Spinner className="h-11 w-11" />
                ) : (
                  <p className="my-2">Submit</p>
                )}
              </button>
              <p className="text-red-600 ">{authErr}</p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Page;
