import { InvoiceMain } from './features/invoice'
import { Button } from './components/Button'
import { useTheme } from './hooks/useTheme'
import styles from './App.module.scss'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={styles.app}>
      <div className="u-no-print">
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
        </Button>
      </div>
      <InvoiceMain />
    </div>
  )
}

export default App
