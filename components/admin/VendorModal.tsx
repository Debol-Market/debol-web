import { Vendor } from '@/utils/types';
import { RiCloseCircleFill } from 'react-icons/ri';
import Overlay from '../Overlay';
type props = {
  vendor: Vendor;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const VendorModal = ({ vendor, setOpen }: props) => {

  return (<Overlay onClick={() => setOpen(false)} >
    <div
      className="rounded-lg bg-white w-full max-w-sm shadow py-6 px-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex px-6 justify-between" onClick={() => setOpen(false)}>
        <p className="text-2xl font-bold text-slate-600 mb-2">{vendor.name}</p>
        <RiCloseCircleFill size={24} className="text-slate-600" />
      </div>
      <div className="border shadow-xl overflow-hidden  aspect-square max-h-[240px] rounded-2xl">
        <img src={vendor.logo} alt="" className="object-cover h-full w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl text-slate-600">
          Name: {vendor.name}
        </h2>
        <p className="text-xl font-bold text-slate-600 mb-2">Address</p>
        {vendor.addresses.map((add, i) => (
          <h2 className="text-slate-600" key={i}>{add} </h2>
        ))}
        {vendor.banners.map((ban, i) => (
          <div className='border shadow-xl overflow-hidden  aspect-square max-h-[240px] rounded-2xl' >
            <img src={ban} key={i} alt="" className="object-cover h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  </Overlay>);
}

export default VendorModal;