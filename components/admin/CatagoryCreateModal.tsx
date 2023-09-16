import { CreateCatagory } from '@/services/database';
import { Catagory } from '@/utils/types';
import { FormEvent, useState } from 'react';
import Overlay from '../Overlay';
import Btn from './Btn';
import Input from './Input';

type props = {
  onClose: VoidFunction;
  onSubmit?: (catagory: Catagory & { id: string }) => void;
};

const CatagoryCreateModal = ({ onClose, onSubmit }: props) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    CreateCatagory(name)
      .then((ref) => {
        onSubmit?.({
          id: ref.key ?? '',
          name,
          count: 0,
        });
        onClose();
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Overlay onClick={onClose}>
      <form
        className="bg-white p-7 rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h1 className="font-bold text-2xl mb-3">Create Catagory</h1>
        <Input
          label="Name"
          onChange={(e) => setName(e.target.value)}
          className="mb-6"
        />
        <Btn
          label="Submit"
          type="submit"
          disabled={!name}
          isLoading={isLoading}
        />
      </form>
    </Overlay>
  );
};

export default CatagoryCreateModal;
