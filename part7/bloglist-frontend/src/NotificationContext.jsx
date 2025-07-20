import { createContext, useReducer, useContext } from 'react'

const initialState = {
  message: null,
  type: ''
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return {
        message: action.payload.message,
        type: action.payload.type
      }
    case 'CLEAR':
      return {
        message: null,
        type: ''
      }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, initialState)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  return useContext(NotificationContext)[0] // { message, type }
}

export const useNotificationDispatch = () => {
  return useContext(NotificationContext)[1] // dispatch()
}
