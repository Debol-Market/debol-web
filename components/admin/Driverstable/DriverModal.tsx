import Overlay from "@/components/Overlay";
import { RiCloseCircleFill } from "react-icons/ri";

type props = {
  setOpenModal: () => void;
}
const DriverModal = ({ setOpenModal }: props) => {

  return (<Overlay onClick={setOpenModal}>
    <div
      className="rounded-lg bg-white w-full max-w-sm shadow py-6 px-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex px-6 justify-between" onClick={setOpenModal}>
        <p className="text-2xl font-bold text-slate-600 mb-2">Items</p>
        <RiCloseCircleFill size={24} className="text-slate-600" />
      </div>

      <div className="flex flex-col gap-5">

      </div>
    </div>
  </Overlay>);
}

export default DriverModal;