import styles from "../style.module.css";

export default function Info({ label, value }: any) {
    return (
        <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{label}</span>
            <span className={styles.infoValue}>{value}</span>
        </div>
    );
}