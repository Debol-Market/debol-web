import useApp from "@/services/appContext";
import { useRouter } from "next/router";

export default function useAdmin(){
  const {user, isAdmin} = useApp();
  const router = useRouter()

  if(!user || !isAdmin) router.push('/admin/login')
}
