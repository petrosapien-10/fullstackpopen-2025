import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'

import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const { isError, isLoading, data } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updateAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map(a => a.id === updateAnecdote.id ? updateAnecdote : a)
      )

      notificationDispatch({
        type: 'SHOW',
        payload: `anecdote '${updateAnecdote.content}' voted`
      })

      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  if (isLoading) {
    return <div>loading data ...</div>
  }

  if (isError) {
    return <span>anecdote service is not available due to problems in server</span>
  }
  const anecdotes = data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
