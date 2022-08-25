import styles from '../styles/Home.module.css'
import BrowserTabHead from '../components/shared/BrowserTabHead'
import Header from '../components/shared/Header'
import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from './LandingPage'


export default function Home() {

  return (
    <div>
      <BrowserTabHead />
        <div>
          <Header />
        </div>
      <div className={styles.container}>
        <main className={styles.submain}>
          <LandingPage />
        </main>
      </div>
    </div>
  )
}
