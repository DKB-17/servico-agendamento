"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { servicoService } from "@/services/api"
import type { Servico, ServicoForm } from "@/types"

// Hook personalizado para gerenciar serviços
export function useServicos() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(false)

  // Carregar lista de serviços
  const carregarServicos = async () => {
    try {
      setLoading(true)
      const data = await servicoService.listar()
      setServicos(data)
    } catch (error) {
      toast.error("Erro ao carregar serviços")
      console.error("Erro ao carregar serviços:", error)
    } finally {
      setLoading(false)
    }
  }

  // Criar novo serviço
  const criarServico = async (formData: ServicoForm) => {
    try {
      await servicoService.criar({
        descricao: formData.descricao,
        valor: Number.parseFloat(formData.valor),
      })
      toast.success("Serviço cadastrado com sucesso!")
      await carregarServicos()
      return true
    } catch (error) {
      toast.error("Erro ao cadastrar serviço")
      console.error("Erro ao criar serviço:", error)
      return false
    }
  }

  // Atualizar serviço existente
  const atualizarServico = async (servico: Servico, formData: ServicoForm) => {
    try {
      await servicoService.atualizar({
        ...servico,
        descricao: formData.descricao,
        valor: Number.parseFloat(formData.valor),
      })
      toast.success("Serviço atualizado com sucesso!")
      await carregarServicos()
      return true
    } catch (error) {
      toast.error("Erro ao atualizar serviço")
      console.error("Erro ao atualizar serviço:", error)
      return false
    }
  }

  // Alternar status do serviço (ativar/desativar)
  const alternarStatus = async (id: number, ativo: boolean) => {
    try {
      if (ativo) {
        await servicoService.desativar(id)
        toast.success("Serviço desativado com sucesso!")
      } else {
        await servicoService.ativar(id)
        toast.success("Serviço ativado com sucesso!")
      }
      await carregarServicos()
    } catch (error) {
      toast.error("Erro ao alterar status do serviço")
      console.error("Erro ao alterar status:", error)
    }
  }

  // Filtrar apenas serviços ativos
  const servicosAtivos = servicos.filter((servico) => servico.deletedAt)

  useEffect(() => {
    carregarServicos()
  }, [])

  return {
    servicos,
    servicosAtivos,
    loading,
    carregarServicos,
    criarServico,
    atualizarServico,
    alternarStatus,
  }
}
