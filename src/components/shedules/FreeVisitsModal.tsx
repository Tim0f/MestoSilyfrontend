import React from 'react';
import bg from '../../assets/svg/bg_mogal.svg';
import Zerno from '../../assets/svg/Zerno.svg';
import btnFrame from '../../assets/svg/button.svg';

interface Props {
  open: boolean;
  onClose: () => void;
}

const FreeVisitsModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="relative w-[95vw] max-w-[1600px] max-h-[85vh] text-white overflow-hidden">
        <img src={bg} alt="" className="absolute inset-0 w-full h-full pointer-events-none" />
        <button onClick={onClose} className="absolute top-[24px] right-[32px] text-customyellow text-[42px] hover:scale-110 transition z-20">×</button>
        <div className="relative z-10 h-full px-[48px] py-[48px] overflow-y-auto">
          {/* контент карточек */}
        </div>
      </div>
    </div>
  );
};

export default FreeVisitsModal;
