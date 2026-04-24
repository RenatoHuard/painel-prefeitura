import { test, expect } from '@playwright/test'
import { doLogin } from './helpers'

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('exibe a tela de login', async ({ page }) => {
    await expect(page.getByText('Acesso Restrito')).toBeVisible()
    await expect(page.getByLabel('E-mail funcional')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
  })

  test('mostra erro com credenciais inválidas', async ({ page }) => {
    await page.getByLabel('E-mail funcional').fill('errado@prefeitura.rio')
    await page.locator('#password').fill('senhaerrada')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('faz login com credenciais corretas e redireciona ao dashboard', async ({ page }) => {
    await doLogin(page)
    await expect(page).toHaveURL('/dashboard')
    // Usa heading para evitar conflito com item de nav
    await expect(page.getByRole('heading', { name: 'Painel Geral' })).toBeVisible()
  })

  test('redireciona para login ao acessar rota protegida sem autenticação', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
