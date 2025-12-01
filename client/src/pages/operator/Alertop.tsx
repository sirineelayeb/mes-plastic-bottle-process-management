import AlertsPanel from '@/components/operator/AlertsPanel'
import { operatorAlerts } from '@/components/operator/mockdataoperator'


function Alertop() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-5">My Alerts</h1>
            <AlertsPanel alerts={operatorAlerts} />
          </div>
  )
}

export default Alertop
