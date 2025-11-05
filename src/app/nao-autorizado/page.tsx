"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./naoAutorizado.module.css";
import { useAuth } from "@/context/AuthContext";

export default function NaoAutorizadoPage() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <div className={styles.content}>
          <h1 className={styles.title}>Acesso não autorizado</h1>
          <p className={styles.description}>
            Você não tem permissão para acessar essa página. Isso pode acontecer
            porque sua conta não possui a função necessária ou porque você não
            está autenticado corretamente.
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => router.replace("/dashboard")}
              title="Voltar ao dashboard"
            >
              Voltar ao início
            </button>

            <button
              type="button"
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => router.back()}
              title="Voltar"
            >
              Voltar (anterior)
            </button>

            <button onClick={() => {
                logout()
            }} className={`${styles.linkBtn}`}>
              Fazer login novamente
            </button>
          </div>

          <div className={styles.help}>
            <small className={styles.small}>
              Código: <strong>403</strong> — Acesso negado
            </small>
          </div>
        </div>
      </section>
    </main>
  );
}
