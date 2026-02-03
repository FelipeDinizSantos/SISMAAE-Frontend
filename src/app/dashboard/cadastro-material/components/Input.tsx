import styles from '../style.module.css';

export default function Input({
    label,
    value,
    onChange,
    maxLength,
}: any) {
    return (
        <div className={styles.formField}>
            <label className={styles.label}>{label}</label>
            <input
                className={styles.input}
                value={value}
                maxLength={maxLength}
                onChange={(e: any) => onChange(e.target.value)}
            />
        </div>
    );
}