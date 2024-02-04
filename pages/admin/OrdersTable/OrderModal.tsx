import Overlay from "@/components/Overlay";
import { Skeleton } from "@/components/ui/skeleton";
import { getUrl } from "@/services/storage";
import { Order } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { RiCloseCircleFill } from "react-icons/ri";

type props = {
  order: Order;
  setOpenModal: () => void;
  orderId: string;
};

const OrderModal = ({ order, setOpenModal }: props) => {
  const { data } = useQuery({
    queryFn: () => getUrl(order.bill ?? ""),
    queryKey: ["getOrderBill", order.bill],
    enabled: !!order.bill,
  });
  return (
    <Overlay onClick={setOpenModal}>
      <div
        className="rounded-lg bg-white w-full max-w-3xl flex flex-col-reverse gap-4 md:flex-row shadow py-2 pb-4 overflow-auto max-h-screen px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {order.bill &&
          (data ? (
            <div className="aspect-square w-full md:w-1/2 shrink-0">
              <img className="object-contain h-full w-full" src={data} />
            </div>
          ) : (
            <Skeleton className="aspect-square w-full md:w-1/2 shrink-0" />
          ))}

        <div>
          <div className="flex justify-between">
            <p className="text-2xl font-bold text-gray-600 mb-2">Details</p>
            <button onClick={setOpenModal}>
              <RiCloseCircleFill size={24} className="text-gray-800" />
            </button>
          </div>
          {order?.user && (
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-800 pl-2 bg-gray-100">
                Sign In Info:
              </h2>
              <div className="flex gap-2 ml-2">
                <h2 className="text-slate-600">Signing Method:</h2>
                <p>{order.user.signinMethod}</p>
              </div>
              {order.user?.phone && (
                <div className="flex gap-2 ml-2">
                  <h2 className="text-slate-600">Phone Number:</h2>
                  <p>{order.user?.phone ?? "UNKNOWN"}</p>
                </div>
              )}
              {order.user?.email && (
                <div className="flex gap-2 ml-2">
                  <h2 className="text-slate-600">Email: </h2>
                  <p>{order.user?.email ?? "UNKNOWN"}</p>
                </div>
              )}
            </div>
          )}
          <div className="mb-2">
            <h2 className="text-lg font-bold text-gray-800 pl-2 bg-gray-100">
              Billing Info:
            </h2>
            {order?.customerInfo && (
              <div className="flex gap-2 ml-2">
                <h2 className="text-gray-700">Name:</h2>
                <p>{order.customerInfo?.name ?? "UNKNOWN"}</p>
              </div>
            )}
            {order.customerInfo?.phone && (
              <div className="flex gap-2 ml-2">
                <h2 className="text-gray-700">Phone Number:</h2>
                <p>{order.customerInfo?.phone ?? "UNKNOWN"}</p>
              </div>
            )}
            {order.customerInfo?.email && (
              <div className="flex gap-2 ml-2">
                <h2 className="text-gray-700">Email: </h2>
                <p>{order.customerInfo?.email ?? "UNKNOWN"}</p>
              </div>
            )}
            <div className="flex gap-2 ml-2">
              <h2 className="text-gray-700">Payment Method:</h2>
              <p>{order.paymentMethod == "stripe" ? "int'l" : "Local"}</p>
            </div>
            {order.bank && (
              <div className="flex gap-2 ml-2">
                <h2 className="text-gray-700">Bank: </h2>
                <p>{order.bank ?? "UNKNOWN"}</p>
              </div>
            )}

            <div className="flex flex-col mb-2">
              <h2 className="text-lg font-bold text-gray-800 pl-2 bg-gray-100">
                Shipping Info:
              </h2>
              <div className="flex flex-col  gap-1 ml-2">
                <h2 className="text-gray-700">
                  phone 1: {order.phone1 ?? "UNKNOWN"}
                </h2>
                {order.phone2.length > 5 && (
                  <h2 className="text-slate-600">phone 2: {order.phone2}</h2>
                )}
              </div>
            </div>
          </div>
          {/* <div className="flex justify-center my-3">
          <QRCodeCanvas value={orderId} size={160} />
        </div> */}

          <div>
            <p className="text-xl font-bold text-slate-600 mb-2">Baskets</p>
            {order.baskets.length !== 0 ? (
              order.baskets.map((item, i) => (
                <div
                  className="flex justify-between items-center px-3 rounded-lg py-2 bg-slate-200 text-lg items"
                  key={i}
                >
                  <div>
                    <p className="">{item.basket?.name}</p>
                    <p className="">
                      {item.basket.sizes.find((s) => s.id == item.sizeId)?.name}
                    </p>
                  </div>
                  <p className="text-slate-900 text-lg font-bold">{item.qty}</p>
                </div>
              ))
            ) : (
              <div></div>
            )}
            <p className="text-xl font-bold text-slate-600 mb-2">Products</p>
            {order.products.length !== 0 ? (
              order.products.map((item, i) => (
                <div
                  className="flex justify-between items-center px-3 rounded-lg py-2 bg-slate-200 text-lg items"
                  key={i}
                >
                  <div>
                    <p className="">{item.product?.name}</p>
                  </div>
                  <p className="text-slate-900 text-lg font-bold">{item.qty}</p>
                </div>
              ))
            ) : (
              <div>no product found</div>
            )}
          </div>
        </div>
      </div>
    </Overlay>
  );
};

export default OrderModal;
