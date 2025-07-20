export const showNotification = (dispatch, message, type = 'success', duration = 3000) => {
  dispatch({
    type: 'SHOW',
    payload: { message, type }
  })
  setTimeout(() => {
    dispatch({ type: 'CLEAR' })
  }, duration)
}
