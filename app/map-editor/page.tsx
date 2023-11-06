import Image from 'next/image'
import styles from './page.module.css'
import AvailableCards from './AvailableCards'

export default function mapEditor() {
  return (
    <main className={styles.main}>
        <AvailableCards />
    </main>
  )
}
