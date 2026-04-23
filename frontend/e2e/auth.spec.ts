import { test, expect } from '@playwright/test'

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('exibe a tela de login', async ({ page }) => {
    await expect(page.getByText('Painel de Acompanhamento')).toBeVisible()
    await expect(page.getByText('Acesso Restrito')).toBeVisible()
    await expect(page.getByLabel('E-mail funcional')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
  })

  test('mostra erro com credenciais inválidas', async ({ page }) => {
    await page.getByLabel('E-mail funcional').fill('errado@prefeitura.rio')
    await page.getByLabel('Senha').fill('senhaerrada')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('faz login com credenciais corretas e redireciona ao dashboard', async ({ page }) => {
    await page.getByLabel('E-mail funcional').fill('tecnico@prefeitura.rio')
    await page.getByLabel('Senha').fill('painel@2024')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Painel Geral')).toBeVisible()
  })

  test('redireciona para login ao acessar rota protegida sem autenticação', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
