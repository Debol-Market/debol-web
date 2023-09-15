import Overlay from "@/components/Overlay";

type props = {
  onDelete: () => void;
  onCancel: () => void;
  delName?: string;
}
const DeleteModal = ({ onDelete, onCancel, delName }: props) => {


  return (<Overlay onClick={onCancel}
  >
    <div
      className="rounded-lg bg-white w-full max-w-xl min-h-100 shadow px-7 py-6"
      onClick={(e) => e.stopPropagation()} >
      <div className="flex justify-center p-4">
        <h2 className="text-2xl font-bold"> Are you sure you want to delete {delName}</h2>
      </div>
      <div className="flex flex-row justify-center items-center gap-10 p-5">
        <button className="bg-amber-500 text-black rounded-lg shadow px-4 py-2" onClick={() => onDelete()}>Yes</button>
        <button className="bg-red-500 text-white rounded-lg shadow px-4 py-2" onClick={onCancel}>No</button>
      </div>
    </div>

  </Overlay>);
}

export default DeleteModal;