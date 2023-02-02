import { Alert, Snackbar } from '@mui/material'
import React, { useState } from 'react'

export const MySnackbar = ({open, severity, message, handleClose}) => {

  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
    <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
    </Alert>
    </Snackbar>
  )
}
