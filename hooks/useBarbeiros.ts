"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { barbeiroService } from "@/services/api"
import type { Barbeiro, BarbeiroForm } from "@/types"

// Hook personalizado para gerenciar barbeiros
export function useBarbeiros() {
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [loading, setLoading] = useState(false)

  // Carregar lista de barbeiros
  const carregarBarbeiros = async () => {
    try {
      setLoading(true)
      const data = await barbeiroService.listar()
      setBarbeiros(data)
    } catch (error) {
      toast.error("Erro ao carregar barbeiros")
      console.error("Erro ao carregar barbeiros:", error)
    } finally {
      setLoading(false)
    }
  }

  // Criar novo barbeiro
  const criarBarbeiro = async (formData: BarbeiroForm) => {
    try {
      await barbeiroService.criar({
        nome: formData.nome,
        servicos: formData.servicosIds,
        horarios: formData.horariosIds,
      })
      toast.success("Barbeiro cadastrado com sucesso!")
      await carregarBarbeiros()
      return true
    } catch (error) {
      toast.error("Erro ao cadastrar barbeiro")
      console.error("Erro ao criar barbeiro:", error)
      return false
    }
  }

  // Atualizar barbeiro existente
  const atualizarBarbeiro = async (barbeiro: Barbeiro, formData: BarbeiroForm) => {
    try {
      await barbeiroService.atualizar({
        ...barbeiro,
        id: barbeiro.id,
        nome: formData.nome,
        caminhoImagem: barbeiro.caminhoImagem,
        servicos: formData.servicosIds,
        horarios: formData.horariosIds,
      })
      toast.success("Barbeiro atualizado com sucesso!")
      await carregarBarbeiros()
      return true
    } catch (error) {
      toast.error("Erro ao atualizar barbeiro")
      console.error("Erro ao atualizar barbeiro:", error)
      return false
    }
  }

  // Alternar status do barbeiro (ativar/desativar)
  const alternarStatus = async (id: number, ativo: string) => {
    try {
      if (ativo) {
        await barbeiroService.ativar(id)
        toast.success("Barbeiro ativado com sucesso!")
      } else {
        await barbeiroService.desativar(id)
        toast.success("Barbeiro desativado com sucesso!")
      }
      await carregarBarbeiros()
    } catch (error) {
      toast.error("Erro ao alterar status do barbeiro")
      console.error("Erro ao alterar status:", error)
    }
  }

  // Filtrar apenas barbeiros ativos
  const barbeirosAtivos = barbeiros.filter((barbeiro) => barbeiro.deletedAt)

  useEffect(() => {
    carregarBarbeiros()
  }, [])

  return {
    barbeiros,
    barbeirosAtivos,
    loading,
    carregarBarbeiros,
    criarBarbeiro,
    atualizarBarbeiro,
    alternarStatus,
  }
}
