import styles from './style.module.css'
import { LinkComponent, Icons, Button, TagsContainer } from '../index'
import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts'

const Card = ({
  name = 'Без названия',
  id,
  image,
  is_favorited,
  category,
  author = {},
  handleLike,
  updateOrders
}) => {
  const authContext = useContext(AuthContext)
  return <div className={styles.card}>
      <LinkComponent
        className={styles.card__title}
        href={`/notes/${id}`}
        title={<div className={styles.card__image} style={{ backgroundImage: `url(${ image })` }} />}
      />
      <div className={styles.card__body}>
        <LinkComponent
          className={styles.card__title}
          href={`/notes/${id}`}
          title={name}
        />
        <CategoryContainer category={category} />
        <div className={styles.card__author}>
          <Icons.UserIcon /> <LinkComponent
            href={`/user/${author.id}`}
            title={`${author.first_name} ${author.last_name}`}
            className={styles.card__link}
          />
        </div>
      </div>
      
      <div className={styles.card__footer}>
          {authContext && <Button
            modifier='style_none'
            clickHandler={_ => {
              handleLike({ id, toLike: Number(!is_favorited) })
            }}
          >
            {is_favorited ? <Icons.StarActiveIcon /> : <Icons.StarIcon />}
          </Button>}
      </div>
  </div>
}

export default Card