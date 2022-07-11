import { Container, IngredientsSearch, FileInput, Input, Title, CheckboxGroup, Main, Form, Button, Checkbox, Textarea } from '../../components'
import styles from './styles.module.css'
import api from '../../api'
import { useEffect, useState } from 'react'
import { useCategory } from '../../utils'
import { useHistory } from 'react-router-dom'
import MetaTags from 'react-meta-tags'

const NoteCreate = ({ onEdit }) => {
  const { value, handleChange, setValue } = useCategory()
  const [ recipeName, setRecipeName ] = useState('')
  const history = useHistory()
  const [ noteText, setNoteText ] = useState('')
  const [ noteFile, setNoteFile ] = useState(null)
  useEffect(_ => {
    api.getCategory()
      .then(category => {
        setValue(category.map(category => ({ ...category, value: true })))
      })
  }, [])

  const checkIfDisabled = () => {
    return noteText === '' ||
    noteName === '' ||
    value.filter(item => item.value).length === 0 ||
    recipeFile === '' ||
    recipeFile === null
  }

  return <Main>
    <Container>
      <MetaTags>
        <title>Создание заметки</title>
        <meta name="description" content="Ваши заметки - Создание заметки" />
        <meta property="og:title" content="Создание заметки" />
      </MetaTags>
      <Title title='Создание заметки' />
      <Form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          const data = {
            text: noteText,
            name: noteName,
            category: value.filter(item => item.value).map(item => item.id),
            image: noteFile
          }
          api
          .createNote(data)
          .then(res => {
            history.push(`/notes/${res.id}`)
          })
          .catch(err => {
            const { non_field_errors } = err
            if (non_field_errors) {
              return alert(non_field_errors.join(', '))
            }
            const errors = Object.values(err)
            if (errors) {
              alert(errors.join(', '))
            }
          })
        }}
      >
        <Input
          label='Название заметки'
          onChange={e => {
            const value = e.target.value
            setNoteName(value)
          }}
        />
        <CheckboxGroup
          label='Категории'
          values={value}
          className={styles.checkboxGroup}
          labelClassName={styles.checkboxGroupLabel}
          tagsClassName={styles.checkboxGroupTags}
          checkboxClassName={styles.checkboxGroupItem}
          handleChange={handleChange}
        />
        <Textarea
          label='Текст Заметки'
          onChange={e => {
            const value = e.target.value
            setNoteText(value)
          }}
        />
        <FileInput
          onChange={file => {
            setNoteFile(file)
          }}
          className={styles.fileInput}
          label='Загрузить изображение'
        />
        <Button
          modifier='style_dark-blue'
          disabled={checkIfDisabled()}
          className={styles.button}
        >
          Создать заметку
        </Button>
      </Form>
    </Container>
  </Main>
}

export default NoteCreate
