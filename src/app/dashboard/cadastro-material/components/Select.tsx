import styles from "../style.module.css";

export default function Select({
    label,
    value,
    options,
    onChange,
}: any) {
    return (
        <div className={styles.formField}>
            <label className={styles.label}>{label}</label>
            <select
                className={styles.select}
                value={value}
                onChange={(e: any) => onChange(e.target.value)}
            >
                {options.map((op: string) => (
                    <option key={op}>{op}</option>
                ))}
            </select>
        </div>
    );
}