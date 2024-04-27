import Navbar from "@/components/admin/Navbar";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import useAdmin from "@/utils/useAdmin";
import Link from "next/link";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import { z } from "zod";
import { toast } from "react-hot-toast";

const Page = () => {
  useAdmin();
  const [open, setOpen] = useState(false);

  const { mutate, status } = useMutation({
    mutationFn: async (code: string) => {
      const schema = z.object({ code: z.string(), orderId: z.string() });

      const obj = JSON.parse(code);
      const validation = schema.safeParse(obj);

      if (validation.success)
        return fetch("/api/verify-order", { method: "POST", body: code }).then(
          (req) => req.json(),
        );
    },
    onSuccess() {
      setTimeout(() => {
        setOpen(false);
      }, 400);
    },
    onError() {
      toast.error("Invalid Code.");
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar name="Dashboard" />
      <div className="flex h-full">
        <div className="p-10 grow h-full flex text-white flex-col items-center gap-5">
          <Link
            href="/admin/orders"
            className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2"
          >
            Orders
          </Link>
          <Link
            href="/admin/baskets"
            className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2"
          >
            Baskets
          </Link>
          <Link
            href="/admin/products"
            className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2"
          >
            Products
          </Link>
          <Link
            href="/admin/contacts"
            className="min-w-[160px] text-lg bg-amber-500 rounded-lg shadow px-10 py-2"
          >
            Contacts
          </Link>

          <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger className="p-2 active:bg-gray-200 rounded-full ">
              Verify Order
            </DialogTrigger>

            <DialogContent className="!rounded-2xl">
              {status != "success" ? (
                <>
                  <Scanner
                    styles={{
                      container: { borderRadius: 16, overflow: "hidden" },
                    }}
                    onResult={(text) => mutate(text)}
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
