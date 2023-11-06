import styles from './page.module.css'
import Card from './Card'
export default function AvailableCards() {
  return (
    <div className={styles.cardWrapper}>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
    </div>
  )
}
