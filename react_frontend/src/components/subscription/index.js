import styles from './styles.module.css'
import cn from 'classnames'
import { Icons, Button, LinkComponent } from '../index'
const countForm = (number, titles) => {
  number = Math.abs(number);
  if (Number.isInteger(number)) {
    let cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number%10<5)?number%10:5] ]
  }
  return titles[1];
}

const Subscription = ({ email, first_name, last_name, username, removeSubscription, notes_count, id, notes }) => {
  const shouldShowButton = notes_count  > 3
  const moreNotes = notes_count - 3
  return <div className={styles.subscription}>
    <div className={styles.subscriptionHeader}>
      <h2 className={styles.subscriptionTitle}>
        <LinkComponent className={styles.subscriptionNoteLink}
        href={`/user/${id}`} title={`${first_name} ${last_name}`} />
      </h2>
    </div>
    <div className={styles.subscriptionBody}>
      <ul className={styles.subscriptionItems}>
        {notes.map(recipe => {
          return <li className={styles.subscriptionItem} key={note.id}>
            <LinkComponent className={styles.subscriptionNoteLink}
            href={`/notes/${note.id}`} title={
              <div className={styles.subscriptionNote}>
                <img src={note.image} alt={note.name} className={styles
                .subscriptionNoteImage} />
                <h3 className={styles.subscriptionNoteTitle}>
                  {note.name}
                </h3>
              </div>
            } />
          </li>
        })}
        {shouldShowButton && <li className={styles.subscriptionMore}>
          <LinkComponent
            className={styles.subscriptionLink}
            title={`Еще ${moreNotes} ${countForm(moreNotes, ['заметка',
            'заметки', 'заметок'])}...`}
            href={`/user/${id}`}
          />
        </li>}
      </ul>
    </div>
    <div className={styles.subscriptionFooter}>
      <Button
        className={styles.subscriptionButton}
        clickHandler={_ => {
          removeSubscription({ id })
        }}
      >
        Отписаться
      </Button>
    </div>
  </div>
}

export default Subscription
