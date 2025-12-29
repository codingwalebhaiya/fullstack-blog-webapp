import React from 'react'
import useAuth from '../../hooks/useAuth'

const AuthorProfile = () => {
  const {user} = useAuth()
  return (
    <div>
      <h2>Profile</h2>
    </div>
  )
}

export default AuthorProfile