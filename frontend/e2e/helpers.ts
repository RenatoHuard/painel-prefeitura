import { Page, expect } from '@playwright/test'

// Login direto — usado apenas quando o storageState não é suficiente
export async function doLogin(page: Page) {
  await page.goto('/login')
  await page.getByLabel('E-mail funcional').fill('tecnico@prefeitura.rio')
  await page.locator('#password').fill('painel@2024')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL('/dashboard', { timeout: 30000 })
}

// Seleciona uma opção em um Radix Select (combobox) pelo label e valor visível
export async function selectRadix(page: Page, label: string, optionText: string) {
  await page.getByLabel(label).click()
  await page.getByRole('option', { name: optionText }).click()
}
