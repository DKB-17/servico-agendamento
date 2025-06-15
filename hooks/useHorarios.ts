"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { horarioService } from "@/services/api"
import type { Horario, HorarioForm } from "@/types"

// Hook personalizado para gerenciar horários
export function useHorarios() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [loading, setLoading] = useState(false)

  // Carregar lista de horários
  const carregarHorarios = async () => {
    try {
      setLoading(true)
      const data = await horarioService.listar()
      setHorarios(data)
    } catch (error) {
      toast.error("Erro ao carregar horários")
      console.error("Erro ao carregar horários:", error)
    } finally {
      setLoading(false)
    }
  }

  // Criar novo horário
  const criarHorario = async (formData: HorarioForm) => {
    try {
      await horarioService.criar({
        horaInicio: formData.horaInicio + ":00",
        horaFim: formData.horaFim + ":00",
      })
      toast.success("Horário cadastrado com sucesso!")
      await carregarHorarios()
      return true
    } catch (error) {
      toast.error("Erro ao cadastrar horário")
      console.error("Erro ao criar horário:", error)
      return false
    }
  }

  // Atualizar horário existente
  const atualizarHorario = async (horario: Horario, formData: HorarioForm) => {
    try {
      await horarioService.atualizar({
        ...horario,
        horarioInicio: formData.horaInicio + ":00",
        horarioFim: formData.horaFim + ":00",
        updatedAt: new Date().toISOString(),
      })
      toast.success("Horário atualizado com sucesso!")
      await carregarHorarios()
      return true
    } catch (error) {
      toast.error("Erro ao atualizar horário")
      console.error("Erro ao atualizar horário:", error)
      return false
    }
  }

  // Alternar status do horário (ativar/desativar)
  const alternarStatus = async (id: number, ativo: boolean) => {
    try {
      if (ativo) {
        await horarioService.desativar(id)
        toast.success("Horário desativado com sucesso!")
      } else {
        await horarioService.ativar(id)
        toast.success("Horário ativado com sucesso!")
      }
      await carregarHorarios()
    } catch (error) {
      toast.error("Erro ao alterar status do horário")
      console.error("Erro ao alterar status:", error)
    }
  }

  // Filtrar apenas horários ativos
  const horariosAtivos = horarios.filter((horario) => horario.deletedAt)
  useEffect(() => {
    carregarHorarios()
  }, [])

  return {
    horarios,
    horariosAtivos,
    loading,
    carregarHorarios,
    criarHorario,
    atualizarHorario,
    alternarStatus,
  }
}
