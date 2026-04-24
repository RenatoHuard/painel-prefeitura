import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ReviewButton } from '@/components/child-detail/ReviewButton'

vi.mock('@/lib/api', () => ({
  reviewChild: vi.fn(),
}))

import { reviewChild } from '@/lib/api'

describe('ReviewButton', () => {
  const onReviewed = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza o botão de marcar como revisado', () => {
    render(<ReviewButton childId="c001" onReviewed={onReviewed} />)
    // Usa aria-label exato do componente
    expect(screen.getByRole('button', { name: /marcar caso como revisado/i })).toBeInTheDocument()
  })

  it('mostra "Registrando..." durante o loading', async () => {
    ;(reviewChild as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    )

    render(<ReviewButton childId="c001" onReviewed={onReviewed} />)
    fireEvent.click(screen.getByRole('button', { name: /marcar caso como revisado/i }))

    expect(await screen.findByText('Registrando...')).toBeInTheDocument()
  })

  it('mostra mensagem de sucesso após revisão', async () => {
    ;(reviewChild as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      success: true,
      revisao: { id: 'rev-1', tecnico: 'tecnico@prefeitura.rio', criadoEm: new Date().toISOString() },
    })

    render(<ReviewButton childId="c001" onReviewed={onReviewed} />)
    fireEvent.click(screen.getByRole('button', { name: /marcar caso como revisado/i }))

    await waitFor(() => {
      expect(screen.getByText(/revisão registrada com sucesso/i)).toBeInTheDocument()
    })
    expect(onReviewed).toHaveBeenCalledTimes(1)
  })

  it('mostra mensagem de erro quando API falha', async () => {
    ;(reviewChild as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Erro ao registrar revisão')
    )

    render(<ReviewButton childId="c001" onReviewed={onReviewed} />)
    fireEvent.click(screen.getByRole('button', { name: /marcar caso como revisado/i }))

    await waitFor(() => {
      expect(screen.getByText('Erro ao registrar revisão')).toBeInTheDocument()
    })
    expect(onReviewed).not.toHaveBeenCalled()
  })
})
