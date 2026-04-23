import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('/login')
    await page.getByLabel('E-mail funcional').fill('tecnico@prefeitura.rio')
    await page.getByLabel('Senha').fill('painel@2024')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('exibe os cards de resumo', async ({ page }) => {
    await expect(page.getByText('Total de Crianças')).toBeVisible()
    await expect(page.getByText('Com Alertas Ativos')).toBeVisible()
    await expect(page.getByText('Casos Revisados')).toBeVisible()
    await expect(page.getByText('Sem Dados em Nenhuma Área')).toBeVisible()
  })

  test('exibe os gráficos', async ({ page }) => {
    await expect(page.getByText('Alertas por Área')).toBeVisible()
    await expect(page.getByText('Alertas por Bairro')).toBeVisible()
  })

  test('exibe o mapa de calor', async ({ page }) => {
    await expect(page.getByText('Mapa de Calor por Bairro')).toBeVisible()
  })

  test('clicar em "Com Alertas Ativos" navega para lista filtrada', async ({ page }) => {
    await page.getByRole('button', { name: /com alertas ativos/i }).click()
    await expect(page).toHaveURL(/\/children\?alertas=true/)
    await expect(page.getByText('Crianças Acompanhadas')).toBeVisible()
  })

  test('clicar em "Alertas — Saúde" navega para lista filtrada por saúde', async ({ page }) => {
    await page.getByRole('button', { name: /alertas.*saúde/i }).click()
    await expect(page).toHaveURL(/\/children\?area=saude/)
  })

  test('clicar em "Sem Dados em Nenhuma Área" filtra crianças sem dados', async ({ page }) => {
    await page.getByRole('button', { name: /sem dados em nenhuma área/i }).click()
    await expect(page).toHaveURL(/\/children\?semDados=true/)
  })
})
