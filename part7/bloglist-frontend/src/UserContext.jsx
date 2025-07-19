import { createContext, useReducer, useContext } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, dispatch] = useReducer(userReducer, null)
  return <UserContext.Provider value={[user, dispatch]}>{props.children}</UserContext.Provider>
}

export const useUserValue = () => useContext(UserContext)[0]
export const useUserDispatch = () => useContext(UserContext)[1]
