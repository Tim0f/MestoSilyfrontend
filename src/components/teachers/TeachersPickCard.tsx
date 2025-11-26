
interface Props {
  teacher: {
    id: string;
    fullName: string;
    position?: string;
    imageUrl?: string;
  };
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function TeacherPickCard({ teacher, selected, onToggle }: Props) {
  return (
    <div
      onClick={() => onToggle(teacher.id)}
      className={`
        cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-3 transition
        ${selected ? "border-yellow-400 bg-yellow-400/10" : "border-white/10 bg-[#222]"}
        hover:border-yellow-400
      `}
      style={{ width: "160px" }}
    >
      <img
        src={teacher.imageUrl || "/default-teacher.png"}
        alt={teacher.fullName}
        className="w-20 h-20 rounded-full object-cover"
      />

      <div className="text-center">
        <p className="font-semibold text-white">{teacher.fullName}</p>
        {teacher.position && (
          <p className="text-xs text-gray-400">{teacher.position}</p>
        )}
      </div>

      {selected && (
        <span className="text-yellow-400 text-sm font-semibold">Выбран</span>
      )}
    </div>
  );
}
