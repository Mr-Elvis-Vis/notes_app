import {
  Card,
  Title,
  Pagination,
  CardList,
  Button,
  CheckboxGroup,
  Container,
  Main 
} from '../../components'
import cn from 'classnames'
import styles from './styles.module.css'
import { useNotes } from '../../utils/index.js'
import { useEffect, useState, useContext } from 'react'
import api from '../../api'
import { useParams, useHistory } from 'react-router-dom'
import { UserContext } from '../../contexts'
import MetaTags from 'react-meta-tags'

const UserPage = ({ updateOrders }) => {
  const {
    notes,
    setNotes,
   notesCount,
    setNotesCount,
    notesPage,
    setNotesPage,
    categoryValue,
    setCategoryValue,
    handleCategoryChange,
    handleLike
  } = useNotes()
  const { id } = useParams()
  const [ user, setUser ] = useState(null)
  const [ subscribed, setSubscribed ] = useState(false)
  const history = useHistory()
  const userContext = useContext(UserContext)

  const getNotes = ({ page = 1, category }) => {
    api
      .getNotes({ page, author: id, category })
        .then(res => {
          const { results, count } = res
          setNotes(results)
          setNotesCount(count)
        })
  }

  const getUser = () => {
    api.getUser({ id })
      .then(res => {
        setUser(res)
        setSubscribed(res.is_subscribed)
      })
      .catch(err => {
        history.push('/notes')
      })
  }

  useEffect(_ => {
    if (!user) { return }
    getNotes({ page: notesPage, category: categoryValue, author: user.id })
  }, [ notesPage, categoryValue, user ])

  useEffect(_ => {
    getUser()
  }, [])

  useEffect(_ => {
    api.getCategory()
      .then(category => {
        setCategoryValue(category.map(category => ({ ...category, value: true })))
      })
  }, [])


  return <Main>
    <Container className={styles.container}>
      <MetaTags>
        <title>{user ? `${user.first_name} ${user.last_name}` : 'Страница пользователя'}</title>
        <meta name="description" content={user ? `Ваши заметки  - ${user.first_name} ${user.last_name}` : 'Ваши заметки  - Страница пользователя'} />
        <meta property="og:title" content={user ? `${user.first_name} ${user.last_name}` : 'Страница пользователя'} />
      </MetaTags>
      <div className={styles.title}>
        <Title
          className={cn({
            [styles.titleText]: (userContext || {}).id !== (user || {}).id
          })}
          title={user ? `${user.first_name} ${user.last_name}` : ''}
        />
        <CheckboxGroup
          values={categoryValue}
          handleChange={value => {
            setNotesPage(1)
            handleCategoryChange(value)
          }}
        />
      </div>
      {(userContext || {}).id !== (user || {}).id && <Button
        className={styles.buttonSubscribe}
        clickHandler={_ => {
          const method = subscribed ? api.deleteSubscriptions.bind(api) : api.subscribe.bind(api) 
            method({
              author_id: id
            })
            .then(_ => {
              setSubscribed(!subscribed)
            })
        }}
      >
        {subscribed ? 'Отписаться от автора' : 'Подписаться на автора'}
      </Button>}
      <CardList>
        {recipes.map(card => <Card
          {...card}
          key={card.id}
          updateOrders={updateOrders}
          handleLike={handleLike}
        />)}
      </CardList>
      <Pagination
        count={notesCount}
        limit={6}
        page={notesPage}
        onPageChange={page => setNotesPage(page)}
      />
    </Container>
  </Main>
}

export default UserPage

