"use client";

interface StatCardProps {
  icon: string;
  label: string;
  value: number; // 0-100
  consequence: string;
  color: "bg-blue-300" | "bg-pink-300" | "bg-green-300" | "bg-purple-300";
}

export function StatCard({ icon, label, value, consequence, color }: StatCardProps) {
  return (
    <div className={`${color} border-3 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
      <div className="flex items-start gap-2">
        <span className="text-lg">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-black text-black">{label}</div>
          <div className="w-full bg-gray-200 border-2 border-black rounded-full h-3 my-1">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-yellow-400 border-2 border-black rounded-full transition-all"
              style={{ width: `${value}%` }}
            />
          </div>
          <div className="text-[8px] text-black/70 font-bold">{consequence}</div>
        </div>
      </div>
    </div>
  );
}
