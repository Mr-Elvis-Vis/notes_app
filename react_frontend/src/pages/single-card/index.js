import { Container, Main, Button, TagsContainer, Icons, LinkComponent } from '../../components'
import { UserContext, AuthContext } from '../../contexts'
import { useContext, useState, useEffect } from 'react'
import styles from './styles.module.css'
import Description from './description'
import cn from 'classnames'
import { useRouteMatch, useParams, useHistory } from 'react-router-dom'
import MetaTags from 'react-meta-tags'

import { useNote } from '../../utils/index.js'
import api from '../../api'

const SingleCard = ({ loadItem, updateOrders }) => {
  const [ loading, setLoading ] = useState(true)
  const {
    note,
    setNote,
    handleLike,
    handleSubscribe
  } = useNote()
  const authContext = useContext(AuthContext)
  const userContext = useContext(UserContext)
  const { id } = useParams()
  const history = useHistory()

  useEffect(_ => {
    api.getNote ({
        note_id: id
      })
      .then(res => {
        setNote(res)
        setLoading(false)
      })
      .catch(err => {
        history.push('/notes')
      })
  }, [])
  
  const { url } = useRouteMatch()
  const {
    author = {},
    image,
    category,
    name,
    text,
    is_favorited,
  } = note
  
  return <Main>
    <Container>
      <MetaTags>
        <title>{name}</title>
        <meta name="description" content={`Ваши заметки  - ${name}`} />
        <meta property="og:title" content={name} />
      </MetaTags>
      <div className={styles['single-card']}>
        <img src={image} alt={name} className={styles["single-card__image"]} />
        <div className={styles["single-card__info"]}>
          <div className={styles["single-card__header-info"]}>
              <h1 className={styles["single-card__title"]}>{name}</h1>
              {authContext && <Button
                modifier='style_none'
                clickHandler={_ => {
                  handleLike({ id, toLike: Number(!is_favorited) })
                }}
              >
                {is_favorited ? <Icons.StarBigActiveIcon /> : <Icons.StarBigIcon />}
              </Button>}
          </div>
          <CategoryContainer category={category} />
          <div>
            <p className={styles['single-card__text']}><Icons.ClockIcon /> {cooking_time} мин.</p>
            <p className={styles['single-card__text_with_link']}>
              <div className={styles['single-card__text']}>
                <Icons.UserIcon /> <LinkComponent
                  title={`${author.first_name} ${author.last_name}`}
                  href={`/user/${author.id}`}
                  className={styles['single-card__link']}
                />
              </div>
              {(userContext || {}).id === author.id && <LinkComponent
                href={`${url}/edit`}
                title='Редактировать заметку'
                className={styles['single-card__edit']}
              />}
            </p>
          </div>
          <div className={styles['single-card__buttons']}>
            {(userContext || {}).id !== author.id && authContext && <Button
              className={styles['single-card__button']}
              modifier='style_light-blue'
              clickHandler={_ => {
                handleSubscribe({ author_id: author.id, toSubscribe: !author.is_subscribed })
              }}
            >
              {author.is_subscribed ? 'Отписаться от автора' : 'Подписаться на автора'}
            </Button>}
          </div>
          <Description description={text} />
        </div>
    </div>
    </Container>
  </Main>
}

export default SingleCard

