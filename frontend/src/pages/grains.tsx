import  GrainManager  from "../components/grains/GrainManager";

export default function GrainsPage() {
  return (
    <div className="p-6">
      <h1 className="text-h2 font-bold mb-6">Управление зернами</h1>
      <GrainManager />
    </div>
  );
}
