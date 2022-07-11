import React, { useState } from "react";
import api from '../api'

export default function useNote () {
  const [ note, setNote ] = useState({})

  const handleLike = ({ id, toLike = 1 }) => {
    const method = toLike ? api.addToFavorites.bind(api) : api.removeFromFavorites.bind(api)
    method({ id }).then(res => {
      const noteUpdated = { ...note, is_favorited: Number(toLike) }
      setNote(noteUpdated)
    })
    .catch(err => {
      const { errors } = err
      if (errors) {
        alert(errors)
      }
    })
  }


  const handleSubscribe = ({ author_id, toSubscribe = 1 }) => {
    const method = toSubscribe ? api.subscribe.bind(api) : api.deleteSubscriptions.bind(api)
      method({
        author_id
      })
      .then(_ => {
        const noteUpdated = { ...note, author: { ...note.author,
        is_subscribed: toSubscribe } }
        setNote(noteUpdated)
      })
      .catch(err => {
        const { errors } = err
        if (errors) {
          alert(errors)
        }
      })
  }

  return {
    note,
    setNote,
    handleLike,
    handleSubscribe
  }
}
