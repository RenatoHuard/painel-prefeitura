import { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export async function doLogin(page: Page) {
  await page.goto('/login')
  await page.getByLabel('E-mail funcional').fill('tecnico@prefeitura.rio')
  await page.locator('#password').fill('painel@2024')
  await page.getByRole('button', { name: 'Entrar' }).click()
  // Aguarda redirecionamento com timeout maior para o Render (free tier é lento)
  await expect(page).toHaveURL('/dashboard', { timeout: 15000 })
}
