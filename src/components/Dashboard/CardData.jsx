import React from 'react'
import BillingTable from '../Common/BillingTable'
import ValidatePaymentsModal from '../Common/ValidatePaymentModal'

function CardData({ userId, self }) {
  return (
    <div className="container">
      <div className="row">
        {self && (
          <div className="col-auto d-flex flex-column justify-content-end me-3">
            <ValidatePaymentsModal userId={userId}/>
          </div>
        )}
        <div className="col">
          <BillingTable dashboard={true} userId={userId} self={true} />
        </div>
      </div>
    </div>
  )
}

export default CardData