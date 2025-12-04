import React from 'react';
import { Check, CheckCircle, Circle, Clock } from 'lucide-react';
import useFetch from '@/hooks/useFetchData';

export default function ProcessTimeline() {
    const {data: currentProcess} = useFetch("/process/current");

    console.log("Current Process:", currentProcess);




  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'done':
        return <Check size={15} />;
      case 'in_progress':
        return <Clock  size={15} />;
      case 'pending':
        return <Clock  size={15} />;
      default:
        return <Clock  size={15} />;
    }
  };


  return (
    <div className="p-6  min-h-screen">
      {currentProcess && currentProcess.process  &&<div className="max-w-7xl mx-auto">
        <div className=" rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold  mb-2">Current Process</h2>
          <div className="flex items-center gap-4 text-sm ">
            <span>Date: {currentProcess.process.datePlanned}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {currentProcess.process.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 ">
            {/* Green progress line */}
            <div 
              className="w-full bg-green-500 transition-all duration-500"
              style={{ 
                height: `${(currentProcess.process.tasks.filter(t => t.status === 'done').length / currentProcess.process.tasks.length) * 100}%` 
              }}
            />
          </div>

          {/* Task columns */}
          <div className="space-y-6">
            {currentProcess.process.tasks.map((processTask, index) => (
              <div key={index} className="relative flex items-start gap-6">
                {/* Timeline dot */}
                <div className="relative bg-green-600 p-3 rounded-[50%] z-10 flex-shrink-0 translate-x-2.5">
                  {getStatusIcon(processTask.status)}
                </div>

                {/* Task card */}
                <div className="flex-1  rounded-lg shadow-md p-5 border-none  hover:shadow-lg transition-shadow"
                     style={{ 
                       borderLeftColor: processTask.status === 'done' ? '#10b981' : 
                                       processTask.status === 'in_progress' ? '#3b82f6' : '#d1d5db' 
                     }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold ">
                        {processTask.task.name}
                      </h3>
                      <p className="text-sm  mt-1">
                        {processTask.task.description}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      processTask.status === 'done' ? 'bg-green-600/20 text-green-500 font-bold' :
                      processTask.status === 'in_progress' ? ' text-blue-700' :
                      'bg-orange-500/20 text-orange-500 font-bold'
                    }`}>
                      {processTask.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br bg-primary rounded-full flex items-center justify-center  font-medium">
                        {processTask.operator.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium ">{processTask.operator.name}</p>
                        <p className="text-xs ">{processTask.operator.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {processTask.operator.skills.map((skill) => (
                        <span key={skill._id} className="px-2 py-1 bg-blue-500/20 text-blue-600 font-bold rounded text-xs">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-6 text-sm ">
                    <div>
                      <span className="font-medium">Start:</span> {processTask.startTime}
                    </div>
                    <div>
                      <span className="font-medium">End:</span> {processTask.endTime}
                    </div>
                    {processTask.startTime && processTask.endTime && (
                      <div>
                        <span className="font-medium">Duration:</span> {
                          Math.round((new Date(processTask.endTime) - new Date(processTask.startTime)) / 60000)
                        } min
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

     
      </div>}
    </div>
  );
}