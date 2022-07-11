import { Card, Title, Pagination, CardList, Container, Main, CheckboxGroup  } from '../../components'
import styles from './styles.module.css'
import { useNotes } from '../../utils/index.js'
import { useEffect } from 'react'
import api from '../../api'
import MetaTags from 'react-meta-tags'

const HomePage = ({ updateOrders }) => {
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


  const getNotes = ({ page = 1, category }) => {
    api
      .getNotes({ page, category })
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
        <title>Заметки</title>
        <meta name="description" content="Ваши заметки - Заметки" />
        <meta property="og:title" content="Заметки" />
      </MetaTags>
      <div className={styles.title}>
        <Title title='Заметки' />
        <CheckboxGroup
          values={tagsValue}
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

export default HomePage

