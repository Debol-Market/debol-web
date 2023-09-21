import Overlay from '@/components/Overlay';
import { Order, OrderItem } from '@/utils/types';
import { RiCloseCircleFill } from 'react-icons/ri';

type props = {
  order: Order;
  orderItems: OrderItem[];
  setOpenModal: () => void;
  orderId: string;
};

const OrderModal = ({ orderItems, order, setOpenModal, orderId }: props) => {
  return (
    <Overlay onClick={setOpenModal}>
      <div
        className="rounded-lg bg-white w-full max-w-sm shadow py-6 px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex px-6 justify-between" onClick={setOpenModal}>
          <p className="text-2xl font-bold text-slate-600 mb-2">Details</p>
          <RiCloseCircleFill size={24} className="text-slate-600" />
        </div>
        {order?.user && (
          <div className="mb-2">
            <h2 className="text-xl font-bold text-slate-800 pl-2 bg-slate-100">
              Sign In Info:
            </h2>
            <div className="flex gap-2 ml-2">
              <h2 className="text-slate-600">Signing Method:</h2>
              <p>{order.user.signinMethod}</p>
            </div>
            {order.user?.phone && (
              <div className="flex gap-2 ml-2">
                <h2 className="text-slate-600">Phone Number:</h2>
                <p>{order.user?.phone ?? 'UNKNOWN'}</p>
              </div>
            )}
            {order.user?.email && (
              <div className="flex gap-2 ml-2">
                <h2 className="text-slate-600">Email: </h2>
                <p>{order.user?.email ?? 'UNKNOWN'}</p>
              </div>
            )}
          </div>
        )}
        {order?.customerInfo && (
          <div className="mb-2">
            <h2 className="text-xl font-bold text-slate-800 pl-2 bg-slate-100">
              Billing Info:
            </h2>
            <div className="flex gap-2 ml-2">
              <h2 className="text-slate-600">Name:</h2>
              <p>{order.customerInfo?.name ?? 'UNKNOWN'}</p>
            </div>
            {order.customerInfo?.phone && (
              <div className="flex gap-2 ml-2">
                <h2 className="text-slate-600">Phone Number:</h2>
                <p>{order.customerInfo?.phone ?? 'UNKNOWN'}</p>
              </div>
            )}
            {order.customerInfo?.email && (
              <div className="flex gap-2 ml-2">
                <h2 className="text-slate-600">Email: </h2>
                <p>{order.customerInfo?.email ?? 'UNKNOWN'}</p>
              </div>
            )}
            <div className="flex flex-col mb-2">
              <h2 className="text-xl font-bold text-slate-800 pl-2 bg-slate-100">
                Shipping Info:
              </h2>
              <div className="flex flex-col gap-1 ml-2">
                <h2 className="text-slate-600">phone 1: </h2>
                <p>{order.phone1 ?? 'UNKNOWN'}</p>
                <h2 className="text-slate-600">phone 2: </h2>
                <p>{order.phone2 ?? "UNKNOWN"}</p>
              </div>
            </div>
          </div>
        )}
        {/* <div className="flex justify-center my-3">
          <QRCodeCanvas value={orderId} size={160} />
        </div> */}

        <div className="flex flex-col gap-5">
          {orderItems.map((item, i) => (
            <div className="flex justify-between items-center px-3 rounded-lg py-2 bg-slate-200 text-lg items"
              key={i}>
              <div>
                <p className="">{item.basket?.name}</p>
                <p className="">
                  {item.basket.sizes.find((s) => s.id == item.sizeId)?.name}
                </p>
              </div>
              <p className="text-slate-900 text-2xl font-bold">{item.qty}</p>
            </div>
          ))}
        </div>
      </div>
    </Overlay>
  );
};

export default OrderModal;
