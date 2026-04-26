import React from 'react'
import BillingTable from '../Common/BillingTable'
import ValidatePaymentsModal from '../Common/ValidatePaymentModal'

function CardData({ userId, self, status_id = false }) {
  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center">
      <div className="w-full h-full min-h-0 flex flex-col gap-4">
        {self && status_id && (
          <div className="w-full flex justify-end">
            <ValidatePaymentsModal userId={userId} />
          </div>
        )}
        <div className="w-full flex-1 min-h-0 overflow-hidden">
          <div className="h-full min-h-0 overflow-auto">
            <BillingTable dashboard={true} userId={userId} self={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardData