import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)

  const [usernameErrText, setusernameErrText] = useState('')
  const [passwordErrText, setpasswordErrText] = useState('')

  const LoginButtontext = 'Login'
  const SignUpReminderText = "Don't have an account yet? Sign up here!"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setusernameErrText('')
    setpasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()

    let err = false

    if (username === '') {
      err = true
      setusernameErrText('This field cannot be empty!')
    }
    if (password === '') {
      err = true
      setpasswordErrText('This field cannot be empty!')
    }

    if (err) return

    setloading(true)

    try {
      const res = await authApi.login({username, password})
      setloading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
      const errors = err.data.errors
      errors.forEach(e => {
        if (e.param === 'username') {
          setusernameErrText(e.msg)
        }
        if (e.param === 'password') {
          setpasswordErrText(e.msg)
        }
      })
    setloading(false)
    }
  }
  return (
    <>
      <Box 
        component='form'
        sx={{mt: 1}}
        onSubmit={handleSubmit}
        noValidate
      >
        <TextField
          margin = 'normal'
          required
          fullWidth
          id='username'
          label='Username'
          name='username'
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField
          margin = 'normal'
          required
          fullWidth
          id='password'
          label='Password'
          name='password'
          type='password'
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <LoadingButton
          sx={{mt:3, mb:2}}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loading}
        >
        {LoginButtontext}
        </LoadingButton>
      </Box>
      <Button
        component={Link}
        to='/signup'
        sx={{textTransform: 'none'}}
      >
      {SignUpReminderText}
      </Button>
    </>
  )
}

export default Login