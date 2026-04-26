import { test, expect } from '@playwright/test'
import { selectRadix } from './helpers'

test.describe('Lista de Crianças', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/children')
    await expect(page.getByRole('heading', { name: 'Crianças Acompanhadas' })).toBeVisible({ timeout: 10000 })
  })

  test('exibe a lista de crianças', async ({ page }) => {
    await expect(page.locator('a[href^="/children/"]').first()).toBeVisible()
  })

  test('filtra por bairro', async ({ page }) => {
    await selectRadix(page, 'Bairro', 'Madureira')
    await expect(page.getByText(/encontrada/)).toBeVisible()
  })

  test('filtra por alertas ativos', async ({ page }) => {
    await selectRadix(page, 'Alertas', 'Com alertas ativos')
    await expect(page.getByText(/encontrada/)).toBeVisible()
  })

  test('busca por nome funciona', async ({ page }) => {
    await page.getByPlaceholder('Nome da criança...').fill('Ana')
    await page.waitForTimeout(500)
    await expect(page.getByText(/encontrada/)).toBeVisible()
  })

  test('limpar filtros reseta a lista', async ({ page }) => {
    await selectRadix(page, 'Bairro', 'Madureira')
    await page.getByText('Limpar').click()
    await expect(page.getByRole('combobox', { name: 'Bairro' })).toContainText('Todos os bairros')
  })
})

test.describe('Detalhe e Revisão', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/children')
    await expect(page.getByRole('heading', { name: 'Crianças Acompanhadas' })).toBeVisible({ timeout: 10000 })
  })

  test('abre o detalhe da criança ao clicar no card', async ({ page }) => {
    await page.locator('a[href^="/children/"]').first().click()
    await expect(page).toHaveURL(/\/children\/c/)
    await expect(page.getByRole('heading', { name: 'Saúde' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Educação' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Assist. Social' })).toBeVisible()
  })

  test('exibe "Sem dados" para áreas sem cadastro', async ({ page }) => {
    await page.goto('/children?semDados=true')
    await page.locator('a[href^="/children/"]').first().click()
    await expect(page).toHaveURL(/\/children\/c/)
    await expect(page.getByText(/sem dados de/i).first()).toBeVisible()
  })

  test('marca caso como revisado', async ({ page }) => {
    await page.locator('a[href^="/children/"]').first().click()
    await expect(page).toHaveURL(/\/children\/c/)
    await page.getByRole('button', { name: /marcar caso como revisado/i }).click()
    await expect(page.getByText(/revisão registrada com sucesso/i)).toBeVisible({ timeout: 8000 })
  })

  test('volta para lista ao clicar em Voltar', async ({ page }) => {
    await page.locator('a[href^="/children/"]').first().click()
    await expect(page).toHaveURL(/\/children\/c/)
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page).toHaveURL('/children')
  })
})
