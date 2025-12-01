import AllStepsList from '@/components/operator/AllStepsList'
import { mySteps } from '@/components/operator/mockdataoperator'


function MyTasks() {
 
  return (
   <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
   <h1 className="text-3xl font-bold mb-5">My Assigned Tasks</h1>
        <AllStepsList steps={mySteps} />
    </div>
  )
}

export default MyTasks
