import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto('http://localhost:3000/login')
  await page.getByLabel('E-mail funcional').fill('tecnico@prefeitura.rio')
  await page.locator('#password').fill('painel@2024')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('**/dashboard', { timeout: 30000 })

  // Salva o estado de autenticação (localStorage com token)
  await page.context().storageState({ path: 'e2e/.auth/user.json' })

  await browser.close()
}

export default globalSetup
