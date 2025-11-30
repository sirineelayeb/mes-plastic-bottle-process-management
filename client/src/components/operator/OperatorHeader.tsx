import type { OperatorInfo } from "@/types/types";

interface OperatorHeaderProps {
  operator: OperatorInfo;
}

function OperatorHeader({ operator }: OperatorHeaderProps) {
  return (
    <div className=" px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
            {operator.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{operator.name}</h1>
            <p className="text-sm text-white">Employee ID: {operator.employeeId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
             {operator.skills.map((skill, idx) => (
              <span 
                key={idx}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium ${
                 operator.activeSkills.includes(skill)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
export default OperatorHeader;