import { useDispatch, useSelector } from "react-redux"
import { incrementVote } from '../reducers/anecdoteReducer'
import PropTypes from 'prop-types'
import { removeNotification, setNotification } from '../reducers/notificationReducer'


const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired
  }),
  handleClick: PropTypes.func.isRequired
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const filtered = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const vote = (anecdote) => {
    dispatch(incrementVote(anecdote))
    dispatch(setNotification(`you voted ${anecdote.content}`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000);
  }

  return (
    <>
      {[...filtered]
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleClick={() => vote(anecdote)} />
        )
      }
    </>
  )
}

export default AnecdoteList