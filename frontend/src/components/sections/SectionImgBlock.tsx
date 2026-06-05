import sticker1 from "../assets/images/sticker1.webp";
import sticker2 from "../assets/images/sticker2.webp";

interface SectionImgBlockProps {
  images?: string[];
}

export default function SectionImgBlock({
  images = [],
}: SectionImgBlockProps) {
  const img1 = images[0] || sticker1;
  const img2 = images[1] || sticker2;
  const img3 = images[2] || sticker1;
  const img4 = images[3] || sticker2;

  return (
    <div className="relative w-[586px] h-[725px]">
      {/* 1 */}
      <div className="absolute left-0 top-0 w-[310px] h-[168px] overflow-hidden rounded-lg">
        <img
          src={img1}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2 */}
      <div className="absolute right-0 top-0 w-[260px] h-[479px] overflow-hidden rounded-lg">
        <img
          src={img2}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* 3 */}
      <div className="absolute left-0 top-[184px] w-[310px] h-[287px] overflow-hidden rounded-lg">
        <img
          src={img3}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* 4 */}
      <div className="absolute left-0 top-[487px] w-[586px] h-[238px] overflow-hidden rounded-lg">
        <img
          src={img4}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}