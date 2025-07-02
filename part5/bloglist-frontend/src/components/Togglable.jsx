import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }
  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>

      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.showButtonLabel}</button>
      </div>

      <div style={showWhenVisible} className='togglable-content'>
        {props.children}
        <button onClick={toggleVisibility}>{props.hideButtonLabel}</button>
      </div>

    </div>
  )
})

Togglable.propTypes = {
  hideButtonLabel: PropTypes.string.isRequired,
  showButtonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Toggable'

export default Togglable