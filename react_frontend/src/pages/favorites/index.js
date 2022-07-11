import { Card, Title, Pagination, CardList, Container, Main, CheckboxGroup  } from '../../components'
import styles from './styles.module.css'
import { useRecipes } from '../../utils/index.js'
import { useEffect } from 'react'
import api from '../../api'
import MetaTags from 'react-meta-tags'

const Favorites = ({ updateOrders }) => {
  const {
    notes,
    setNotes,
    notesCount,
    setNotesCount,
    notesPage,
    setNotesPage,
    categoryValue,
    handleCategoryChange,
    setCategoryValue,
    handleLike,
  } = useNotes()
  
  const getNotes= ({ page = 1, category }) => {
    api
      .getNotes({ page, is_favorited: Number(true), category })
      .then(res => {
        const { results, count } = res
        setNotes(results)
        setNotesCount(count)
      })
  }

  useEffect(_ => {
    getNotes({ page: notesPage, category: categoryValue })
  }, [notesPage, categoryValue])

  useEffect(_ => {
    api.getCategory()
      .then(category => {
        setCategoryValue(category.map(category => ({ ...category, value: true
        })))
      })
  }, [])


  return <Main>
    <Container>
      <MetaTags>
        <title>Избранное</title>
        <meta name="description" content="Ваши заметки - Избранное" />
        <meta property="og:title" content="Избранное" />
      </MetaTags>
      <div className={styles.title}>
        <Title title='Избранное' />
        <CheckboxGroup
          values={categoryValue}
          handleChange={value => {
            setNotesPage(1)
            handleCategoryChange(value)
          }}
        />
      </div>
      <CardList>
        {notes.map(card => <Card
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

export default Favorites

