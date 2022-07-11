import styles from './styles.module.css'
import cn from 'classnames'
import { Tag } from '../index'

const CategoryContainer = ({ category }) => {
  if (!category) { return null }
  return <div className={styles['category-container']}>
    {category.map(category => {
      return <Category
        key={category.id}
        color={category.color}
        name={category.name}
      />
    })}
  </div>
}

export default CategoryContainer
