import styles from "./page.module.css";
import AvailableCards from "./AvailableCards";
import Map from "./Map";

export default function mapEditor() {
	return (
		<main className={styles.main}>
			<AvailableCards />
			<Map />
		</main>
	);
}
