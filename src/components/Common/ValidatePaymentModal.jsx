import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useAuth } from '../../AuthContext'

function ValidatePaymentsModal({ userId }) {
  const [showModal, setShowModal] = useState(false)
  const [finances, setFinances] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { user } = useAuth()

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `http://localhost:8000/finances/?user_id=${userId}&validated=false&pending=true&order=true`,
        { headers: { Accept: 'application/json' } }
      )
      if (!res.ok) throw new Error('Failed to fetch finances')
      const data = await res.json()
      setFinances(data.data || [])
      setShowModal(true)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (paymentId, action) => {
    if (!user?.user_id) {
      console.error('No user logged in')
      return
    }

    try {
      const res = await fetch(
        `http://localhost:8000/finances/${paymentId}/${action}`,
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id })
        }
      )

      if (!res.ok) throw new Error(`${action} failed`)

      const data = await res.json()
      console.log(`${action} successful:`, data)

      // Remove the modified row from finances
      setFinances((prev) => prev.filter((f) => f.id !== paymentId))
    } catch (err) {
      console.error(err)
      alert(`Error: ${err.message}`)
    }
  }

  return (
    <>
      <Button onClick={handleClick} variant="primary">
        Validate Payments
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Pending Finances</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && finances.length === 0 && <p>No pending finances.</p>}
          {!loading && !error && finances.length > 0 && (
            <table className="table table-striped text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Work Date</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Confirm</th>
                  <th>Reject</th>
                </tr>
              </thead>
              <tbody>
                {finances.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{new Date(f.work_date).toLocaleString()}</td>
                    <td>{f.name}</td>
                    <td>{f.amount}</td>
                    <td>
                      <button onClick={() => handleAction(f.id, 'validate')}>√</button>
                    </td>
                    <td>
                      <button onClick={() => handleAction(f.id, 'reject')}>X</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button>
                        Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ValidatePaymentsModal