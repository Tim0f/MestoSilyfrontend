import React from 'react';

type CardProps = {
  Image: string;
  name: string;
  position: string;
  audiosrc: string;
};

export default function TeamCard({ Image, name, position, audiosrc }: CardProps) {
  return (
    <div className="p-6 w-590 flex flex-col items-center text-customwhite">
        <div className='w-590 h-590 rounded-full border-2 border-customyellow flex items-center justify-center align-center p-3'>
<div className="w-537 h-537 rounded-full overflow-hidden ">
        <img src={Image} alt={name} className="object-cover w-full h-full" />
      </div>

        </div>
      
      <div className="text-p font-p text-center ">{position}</div>
      <div className="font-bold text-h2 font-h2 text-center">{name}</div>
      <audio controls className="w-full">
        <source src={audiosrc} type="audio/mpeg" />
        Ваш браузер не поддерживает аудио.
      </audio>
    </div>
  );
}
