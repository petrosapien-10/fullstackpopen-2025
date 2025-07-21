import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Button } from '@mui/material'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility
  }))

  return (
    <Box>
      {!visible && (
        <Button variant='contained' onClick={toggleVisibility} sx={{ mb: 2 }}>
          {props.showButtonLabel}
        </Button>
      )}

      {visible && (
        <Box>
          <Box sx={{ mb: 2 }}>{props.children}</Box>
          <Button variant='outlined' color='secondary' onClick={toggleVisibility}>
            {props.hideButtonLabel}
          </Button>
        </Box>
      )}
    </Box>
  )
})

Togglable.propTypes = {
  hideButtonLabel: PropTypes.string.isRequired,
  showButtonLabel: PropTypes.string.isRequired,
  children: PropTypes.node
}

Togglable.displayName = 'Togglable'

export default Togglable
