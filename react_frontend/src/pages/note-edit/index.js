import { Container, FileInput, Input, Title, CheckboxGroup, Main, Form, Button, Checkbox, Textarea } from '../../components'
import styles from './styles.module.css'
import api from '../../api'
import { useEffect, useState } from 'react'
import { useCategory } from '../../utils'
import { useParams, useHistory } from 'react-router-dom'
import MetaTags from 'react-meta-tags'

const NoteEdit = ({ onItemDelete }) => {
  const { value, handleChange, setValue } = useCategory()
  const [ noteName, setNoteName ] = useState('')

  const [ noteText, setNoteText ] = useState('')
  const [ noteFile, setNoteFile ] = useState(null)
  const [
    noteFileWasManuallyChanged,
    setNoteFileWasManuallyChanged
  ] = useState(false)

  const [ loading, setLoading ] = useState(true)
  const history = useHistory()

  useEffect(_ => {
    api.getCategory()
      .then(category => {
        setValue(category.map(category => ({ ...category, value: true })))
      })
  }, [])

  const { id } = useParams()
  useEffect(_ => {
    if (value.length === 0 || !loading) { return }
    api.getNote ({
      note_id: id
    }).then(res => {
      const {
        image,
        category,
        name,
        text
      } = res
      setNoteText(text)
      setNoteName(name)
      setNoteFile(image)


      const categoryValueUpdated = value.map(item => {
        item.value = Boolean(category.find(category => category.id === item.id))
        return item
      })
      setValue(categoryValueUpdated)
      setLoading(false)
    })
    .catch(err => {
      history.push('/notes')
    })
  }, [value])

  const checkIfDisabled = () => {
    return noteText === '' ||
    noteName === '' ||
    value.filter(item => item.value).length === 0 ||
    noteFile === '' ||
   noteFile === null
  }

  return <Main>
    <Container>
      <MetaTags>
        <title>Редактирование заметки</title>
        <meta name="description" content="Ваши заметки - Редактирование
        заметки" />
        <meta property="og:title" content="Редактирование заметки" />
      </MetaTags>
      <Title title='Редактирование заметки' />
      <Form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          const data = {
            text: noteText,
            name: noteName,
            category: value.filter(item => item.value).map(item => item.id),
            image: noteFile,
            note_id: id
          }
          api
            .updateNote(data, noteFileWasManuallyChanged)
            .then(res => {
              history.push(`/notes/${id}`)
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
          value={noteName}
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
          label='Описание заметки'
          onChange={e => {
            const value = e.target.value
            setNoteText(value)
          }}
          value={noteText}
        />
        <FileInput
          onChange={file => {
            setNoteFileWasManuallyChanged(true)
            setNoteFile(file)
          }}
          className={styles.fileInput}
          label='Загрузить изображение'
          file={recipeFile}
        />
        <div className={styles.actions}>
          <Button
            modifier='style_dark-blue'
            disabled={checkIfDisabled()}
            className={styles.button}
          >
            Редактировать заметку
          </Button>
          <div
            className={styles.deleteRecipe}
            onClick={_ => {
              api.deleteRecipe({ recipe_id: id })
                .then(res => {
                  onItemDelete && onItemDelete()
                  history.push('/notes')
                })
            }}
          >
            Удалить
          </div>
        </div>
      </Form>
    </Container>
  </Main>
}

export default NoteEdit
