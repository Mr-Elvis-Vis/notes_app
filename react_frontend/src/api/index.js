class Api {
  constructor (url, headers) {
    this._url = url
    this._headers = headers
  }

  checkResponse (res) {
    return new Promise((resolve, reject) => {
      if (res.status === 204) {
        return resolve(res)
      }
      const func = res.status < 400 ? resolve : reject
      res.json().then(data => func(data))
    })
  }

  signin ({ email, password }) {
    return fetch(
      '/api/auth/token/login/',
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          email, password
        })
      }
    ).then(this.checkResponse)
  }

  signout () {
    const token = localStorage.getItem('token')
    return fetch(
      '/api/auth/token/logout/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  signup ({ email, password, username, first_name, last_name }) {
    return fetch(
      `/api/users/`,
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          email, password, username, first_name, last_name
        })
      }
    ).then(this.checkResponse)
  }

  getUserData () {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/me/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  changePassword ({ current_password, new_password }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/set_password/`,
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({ current_password, new_password })
      }
    ).then(this.checkResponse)
  }


  // recipes

  getNotes ({
    page = 1,
    limit = 6,
    is_favorited = 0,
    author,
    category
  } = {}) {
      const token = localStorage.getItem('token')
      const authorization = token ? { 'authorization': `Token ${token}` } : {}
      const categoryString = category ? category.filter(category => category.value).map(category => `&category=${category.slug}`).join('') : ''
      return fetch(
        `/api/notes/?page=${page}&limit=${limit}${author ? `&author=${author}`
        : ''}${is_favorited ? `&is_favorited=${is_favorited}` : ''}${categoryString}`,
        {
          method: 'GET',
          headers: {
            ...this._headers,
            ...authorization
          }
        }
      ).then(this.checkResponse)
  }

  getNote ({
    note_id
  }) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      `/api/notes/${note_id}/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          ...authorization
        }
      }
    ).then(this.checkResponse)
  }

  createNote ({
    name = '',
    image,
    category = [],
    text = ''
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      '/api/notes/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          name,
          image,
          category,
          text
        })
      }
    ).then(this.checkResponse)
  }

  updateNote ({
    name,
    note_id,
    image,
    category,
    text
  }, wasImageUpdated) { // image was changed
    const token = localStorage.getItem('token')
    return fetch(
      `/api/notes/${note_id}/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          name,
          id: note_id,
          image: wasImageUpdated ? image : undefined,
          category,
          text
        })
      }
    ).then(this.checkResponse)
  }

  addToFavorites ({ id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/notes/${id}/favorite/`,
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  removeFromFavorites ({ id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/notes/${id}/favorite/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  getUser ({ id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/${id}/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  getUsers ({
    page = 1,
    limit = 6
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  // subscriptions

  getSharingList ({
    page, 
    limit = 6,
    recipes_limit = 3
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/sharing_list/?page=${page}&limit=${limit}&recipes_limit=$
      {recipes_limit}`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  deleteSharing ({
    user_id
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/${user_id}/sharing/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  sharing ({
    user_id
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/${user_id}/sharing/`,
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  // category

  getCategory () {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/category/`,
      {
        method: 'GET',
        headers: {
          ...this._headers
        }
      }
    ).then(this.checkResponse)
  }

  deleteNote ({ note_id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/notes/${note_id}/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

}

export default new Api(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })
