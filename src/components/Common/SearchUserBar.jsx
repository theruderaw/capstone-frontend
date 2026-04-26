import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from './Toast'

function SearchUserBar({ userId }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastOpen, setToastOpen] = useState(false)
  const navigate = useNavigate()

  const showToast = (message) => {
    setToastMessage(message)
    setToastOpen(true)
  }

  const handleSearch = async (event) => {
    event.preventDefault()

    const trimmed = query.trim()
    if (!trimmed) {
      showToast('Please enter a name to search.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/user/all/${userId}`, {
        headers: { Accept: 'application/json' },
      })
      const data = await res.json()

      if (!res.ok || data.status !== 'OK' || !Array.isArray(data.data)) {
        throw new Error('Unable to fetch user list')
      }

      const normalizedQuery = trimmed.toLowerCase()
      const matches = data.data.filter((item) =>
        item?.name?.toLowerCase().includes(normalizedQuery)
      )

      if (matches.length === 0) {
        showToast(`No users found matching "${trimmed}".`)
        return
      }

      const exactMatches = matches.filter(
        (item) => item.name.toLowerCase() === normalizedQuery
      )
      const selectedUser =
        exactMatches.length === 1 ? exactMatches[0] : matches.length === 1 ? matches[0] : null

      if (!selectedUser) {
        showToast('Multiple users found. Please refine your search.')
        return
      }

      navigate(`/profile/${selectedUser.user_id}`)
    } catch (error) {
      console.error(error)
      showToast('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl px-4 py-3 bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-gray-200">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center">
        <label htmlFor="user-search" className="sr-only">
          Search user by name
        </label>
        <input
          id="user-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search users by name"
          className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <Toast
        show={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        title="User Search"
      />
    </div>
  )
}

export default SearchUserBar
