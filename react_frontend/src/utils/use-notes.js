import React, { useState } from "react";
import { useCategory } from './index.js'
import api from '../api'

export default function useRecipes () {
  const [ notes, setNotes ] = useState([])
  const [ notesCount, setNOtesCount ] = useState(0)
  const [ notesPage, setNotesPage ] = useState(1)
  const { value: categoryValue, handleChange: handleCategoryChange, setValue:
  setCategoryValue } = useCategory()

  const handleLike = ({ id, toLike = true }) => {
    const method = toLike ? api.addToFavorites.bind(api) : api.removeFromFavorites.bind(api)
    method({ id }).then(res => {
      const notesUpdated = notes.map(note => {
        if (note.id === id) {
          note.is_favorited = toLike
        }
        return note
      })
      setNotes(notesUpdated)
    })
    .catch(err => {
      const { errors } = err
      if (errors) {
        alert(errors)
      }
    })
  }


  return {
    notes,
    setNotes,
    notesCount,
    setNotesCount,
    notesPage,
    setNotesPage,
    categoryValue,
    handleLike,
    handleCategoryChange,
    setCategoryValue
  }
}
