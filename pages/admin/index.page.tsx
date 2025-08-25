import Spinner from "@/components/Spinner";
import {Card,CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Navbar from "@/components/admin/Navbar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useApp from "@/services/appContext";
import useAdmin from "@/utils/useAdmin";
import { useMutation } from "@tanstack/react-query";
import { Scanner } from "@yudiel/react-qr-scanner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { z } from "zod";
import { ShoppingCart, Package, Inbox, CheckCircle, Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import * as admin from 'firebase-admin';
import { Button } from "@/components/ui/button";

const Page = () => {
  useAdmin();
  const { user } = useApp();
  const [open, setOpen] = useState(false);

  const { mutate, status, reset } = useMutation({
    mutationFn: async (code: string) => {
      const schema = z.object({ code: z.string(), orderId: z.string() });

      const obj = JSON.parse(code);
      schema.parse(obj);

      const token = await user?.getIdToken();

      const res = await fetch("/api/verify-order", {
        method: "POST",
        body: code,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();
    },
    onSuccess() {
      setTimeout(() => {
        setOpen(false);
      }, 400);
    },
    onError() {
      toast.error("Invalid Code.");
      reset();
    },
  });

  useEffect(() => {
    if (open && status == "success") reset();
  }, [open]);

  return (
    <div className="min-h-screen">
      <Navbar name="Dashboard" />
      <div className="flex h-full">
        <div className="p-10 grow h-full flex flex-auto text-white  items-center gap-5">
         <Card className="">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">200</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
          <Link
            href="/admin/orders"
            className="text-base  text-amber-500    flex flex-auto  items-end px-4 py-1"
          >
            Orders
          </Link>
          </Card> 
            <Card className="">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Baskets</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">200</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
          <Link
            href="/admin/baskets"
            className="text-base  text-amber-500    flex flex-auto  items-end px-4 py-1"
          >
            Baskets
          </Link>
          </Card>
            <Card className="">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">200</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
          <Link
            href="/admin/products"
            className="text-base  text-amber-500    flex flex-auto  items-end px-4 py-1"
          >
            Products
          </Link>
          </Card>
           <Card className="">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inbox</CardTitle>
                    <Inbox className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">200</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
          <Link
            href="/admin/contacts"
            className="text-base  text-amber-500    flex flex-auto  items-end px-4 py-1"
          >
            Inbox
          </Link>
          </Card>

         <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button className="text-sm border border-gray-200 hover:bg-gray-50 text-black px-1 py-1 "variant="ghost">
                   <CheckCircle className="h-4 w-4 text-black m-2 " />
                    Verify Order
                </Button>
            </DialogTrigger>

            <DialogContent className="!rounded-2xl">
              {status != "success" ? (
                <>
                  <Scanner
                    styles={{
                      container: { borderRadius: 16, overflow: "hidden" },
                    }}
                    onResult={(text) => {
                      if (status != "loading") mutate(text);
                    }}
                    onError={(error) => console.log(error?.message)}
                  />
                  {status == "loading" && (
                    <div className="absolute rounded-2xl top-6 bottom-6 left-6 right-6 bg-black/60 flex items-center justify-center">
                      <Spinner className="h-24 text-primary w-24" />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center ">
                  <IoMdCheckmarkCircleOutline
                    size={96}
                    className="text-primary"
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* <Link */}
          {/*   href="/admin/drivers" */}
          {/*   className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2" */}
          {/* > */}
          {/*   Drivers */}
          {/* </Link> */}
        </div>
         
      </div>
    </div>
  );
};

export default Page;
