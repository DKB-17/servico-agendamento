"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { agendamentoService } from "@/services/api"
import type { Agendamento, AgendamentoForm } from "@/types"

// Hook personalizado para gerenciar agendamentos
export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(false)

  // Carregar lista de agendamentos
  const carregarAgendamentos = async () => {
    try {
      setLoading(true)
      const data = await agendamentoService.listar()
      setAgendamentos(data)
    } catch (error) {
      toast.error("Erro ao carregar agendamentos")
      console.error("Erro ao carregar agendamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  // Criar novo agendamento
  const criarAgendamento = async (formData: AgendamentoForm, data: Date) => {
    try {
      await agendamentoService.criar({
        nome: formData.nome,
        contato: formData.contato,
        barbeiroId: Number.parseInt(formData.barbeiroId),
        servicoId: Number.parseInt(formData.servicoId),
        horarioId: Number.parseInt(formData.horarioId),
        dia: data.toISOString(),
      })
      toast.success("Agendamento realizado com sucesso!")
      await carregarAgendamentos()
      return true
    } catch (error) {
      toast.error("Erro ao realizar agendamento")
      console.error("Erro ao criar agendamento:", error)
      return false
    }
  }

  // Cancelar agendamento
  const cancelarAgendamento = async (id: number) => {
    try {
      await agendamentoService.desativar(id)
      toast.success("Agendamento cancelado com sucesso!")
      await carregarAgendamentos()
    } catch (error) {
      toast.error("Erro ao cancelar agendamento")
      console.error("Erro ao cancelar agendamento:", error)
    }
  }

  // Filtrar apenas agendamentos ativos
  const agendamentosAtivos = agendamentos.filter((agendamento) => agendamento.ativo)

  useEffect(() => {
    carregarAgendamentos()
  }, [])

  return {
    agendamentos,
    agendamentosAtivos,
    loading,
    carregarAgendamentos,
    criarAgendamento,
    cancelarAgendamento,
  }
}
