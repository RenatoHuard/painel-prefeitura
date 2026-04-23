import { test, expect } from '@playwright/test'

test.describe('Lista de Crianças', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail funcional').fill('tecnico@prefeitura.rio')
    await page.getByLabel('Senha').fill('painel@2024')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL('/dashboard')
    await page.goto('/children')
  })

  test('exibe a lista de crianças', async ({ page }) => {
    await expect(page.getByText('Crianças Acompanhadas')).toBeVisible()
    // Aguarda pelo menos um card aparecer
    await expect(page.locator('a[href^="/children/"]').first()).toBeVisible()
  })

  test('filtra por bairro', async ({ page }) => {
    await page.getByLabel('Bairro').selectOption('Madureira')
    await expect(page.getByText(/encontrada/)).toBeVisible()
  })

  test('filtra por alertas ativos', async ({ page }) => {
    await page.getByLabel('Alertas').selectOption('true')
    // Todos os cards devem ter badge de alerta
    const alertBadges = page.locator('[title*="alertas"]')
    const count = await alertBadges.count()
    expect(count).toBeGreaterThan(0)
  })

  test('busca por nome funciona', async ({ page }) => {
    await page.getByPlaceholder('Nome da criança...').fill('Ana')
    await page.waitForTimeout(500) // debounce
    await expect(page.getByText(/encontrada/)).toBeVisible()
  })

  test('limpar filtros reseta a lista', async ({ page }) => {
    await page.getByLabel('Bairro').selectOption('Madureira')
    await page.getByText('Limpar').click()
    await expect(page.getByLabel('Bairro')).toHaveValue('todos')
  })
})

test.describe('Detalhe e Revisão', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail funcional').fill('tecnico@prefeitura.rio')
    await page.getByLabel('Senha').fill('painel@2024')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL('/dashboard')
    await page.goto('/children')
  })

  test('abre o detalhe da criança ao clicar no card', async ({ page }) => {
    await page.locator('a[href^="/children/"]').first().click()
    await expect(page.getByText('Saúde')).toBeVisible()
    await expect(page.getByText('Educação')).toBeVisible()
    await expect(page.getByText('Assist. Social')).toBeVisible()
  })

  test('exibe "Sem dados" para áreas sem cadastro', async ({ page }) => {
    // Navega para Camila Souza — sem dados em nenhuma área
    await page.goto('/children?semDados=true')
    await page.locator('a[href^="/children/"]').first().click()
    await expect(page.getByText(/sem dados de/i).first()).toBeVisible()
  })

  test('marca caso como revisado', async ({ page }) => {
    await page.locator('a[href^="/children/"]').first().click()
    await page.getByRole('button', { name: /marcar como revisado/i }).click()
    await expect(page.getByText(/revisão registrada com sucesso/i)).toBeVisible()
  })

  test('volta para lista ao clicar em Voltar', async ({ page }) => {
    await page.locator('a[href^="/children/"]').first().click()
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page).toHaveURL('/children')
  })
})
