"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
<<<<<<< HEAD
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Users, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { formatarMoeda } from "@/utils/formatters"
import { AgendamentosDia } from "@/components/caixa/AgendamentosDia"

// Interface para o response do faturamento total
interface FaturamentoTotalResponse {
  valor: number
}

// Interface para dados consolidados do caixa
interface CaixaData {
  totalFaturamento: number
  faturamentoTotal: number 
  totalAgendamentos: number
  agendamentosHoje: number
  servicoMaisVendido: string
  ticketMedio: number
  taxaCancelamento: number
=======
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface CaixaData {
  totalFaturamento: number
  totalAgendamentos: number
  agendamentosHoje: number
  servicoMaisVendido: string
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
}

export default function CaixaPage() {
  const [caixaData, setCaixaData] = useState<CaixaData | null>(null)
<<<<<<< HEAD
  const [loading, setLoading] = useState(true)
  const [loadingFaturamento, setLoadingFaturamento] = useState(false)

  useEffect(() => {
    carregarDadosCaixa()
  }, [])
  // Carregar faturamento total da API
  const carregarFaturamentoTotal = async (): Promise<number> => {
    try {
      setLoadingFaturamento(true)
      const response = await fetch("http://localhost:8080/caixas/faturamento-total")

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data: FaturamentoTotalResponse = await response.json()
      return data
    } catch (error) {
      console.error("Erro ao carregar faturamento total:", error)
      toast.error("Erro ao carregar faturamento total")
      return 0
    } finally {
      setLoadingFaturamento(false)
    }
  }

  // Carregar outros dados do caixa (simulados por enquanto)
  const carregarOutrosDados = async () => {
    try {
      // Aqui você pode fazer outras chamadas para APIs específicas
      // Por enquanto, vamos simular alguns dados

      // Exemplo de outras possíveis APIs:
      // const agendamentosResponse = await fetch("http://localhost:8080/caixa/total-agendamentos")
      // const agendamentosHojeResponse = await fetch("http://localhost:8080/caixa/agendamentos-hoje")

      return {
        totalAgendamentos: 0,
        agendamentosHoje: 0,
        servicoMaisVendido: "Corte + Barba",
        ticketMedio: 0,
        taxaCancelamento: 0,
      }
    } catch (error) {
      console.error("Erro ao carregar outros dados:", error)
      return {
        totalAgendamentos: 0,
        agendamentosHoje: 0,
        servicoMaisVendido: "N/A",
        ticketMedio: 0,
        taxaCancelamento: 0,
      }
    }
  }

  // Carregar todos os dados do caixa
  const carregarDadosCaixa = async () => {
    try {
      setLoading(true)

      // Carregar dados em paralelo
      const [faturamentoTotal, outrosDados] = await Promise.all([carregarFaturamentoTotal(), carregarOutrosDados()])

      setCaixaData({
        faturamentoTotal,
        ...outrosDados,
      })

      toast.success("Dados do caixa carregados com sucesso!")
    } catch (error) {
      toast.error("Erro ao carregar dados do caixa")
      console.error("Erro ao carregar dados do caixa:", error)
    } finally {
      setLoading(false)
    }
  }

  // Atualizar apenas o faturamento total
  const atualizarFaturamento = async () => {
    const novoFaturamento = await carregarFaturamentoTotal()

    if (caixaData) {
      setCaixaData({
        ...caixaData,
        faturamentoTotal: novoFaturamento,
      })
=======

  useEffect(() => {
    fetchCaixaData()
  }, [])

  const fetchCaixaData = async () => {
    try {
      const response = await fetch("http://localhost:8080/caixas")
      const data = await response.json()

      // Como a API retorna uma lista, vamos simular dados do caixa
      // Em uma implementação real, a API deveria retornar dados consolidados
      setCaixaData({
        totalFaturamento: 2500.0,
        totalAgendamentos: 45,
        agendamentosHoje: 8,
        servicoMaisVendido: "Corte + Barba",
      })
    } catch (error) {
      toast.error("Erro ao carregar dados do caixa")
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
<<<<<<< HEAD
        <div className="flex justify-between items-center mb-6">
          <div>
=======
        <div className="mb-6">
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
          <Link href="/admin">
            <Button variant="ghost" className="text-white hover:text-amber-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Admin
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Relatório de Caixa</h1>
          <p className="text-slate-300">Acompanhe o desempenho financeiro da barbearia</p>
        </div>

<<<<<<< HEAD
        <div className="flex space-x-2">
            <Button
              onClick={atualizarFaturamento}
              variant="outline"
              className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black"
              disabled={loadingFaturamento}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              {loadingFaturamento ? "Atualizando..." : "Atualizar Faturamento"}
            </Button>

            <Button
              onClick={carregarDadosCaixa}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {loading ? "Carregando..." : "Atualizar Tudo"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Carregando dados do caixa...</p>
          </div>
        ) : caixaData ? (
          <>
        {/* Cards de métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Faturamento Total</CardTitle>
                <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-amber-500" />
                {loadingFaturamento && (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-amber-500"></div>
                )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{formatarMoeda(caixaData.faturamentoTotal)}</div>
                
=======
        {caixaData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Faturamento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">R$ {caixaData.totalFaturamento.toFixed(2)}</div>
                <p className="text-xs text-slate-400">+20.1% em relação ao mês anterior</p>
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total de Agendamentos</CardTitle>
                <Calendar className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{caixaData.totalAgendamentos}</div>
                <p className="text-xs text-slate-400">+15% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Agendamentos Hoje</CardTitle>
                <Users className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{caixaData.agendamentosHoje}</div>
                <p className="text-xs text-slate-400">+2 em relação a ontem</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Serviço Mais Vendido</CardTitle>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{caixaData.servicoMaisVendido}</div>
                <p className="text-xs text-slate-400">35% dos agendamentos</p>
              </CardContent>
            </Card>
          </div>
<<<<<<< HEAD

        {/* Novo componente de agendamentos por dia */}
        <div className="mb-8">
          <AgendamentosDia />
        </div>
        
        {/* Cards de resumo detalhado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Resumo Financeiro</CardTitle>
              <CardDescription className="text-slate-300">Métricas financeiras do período</CardDescription>
=======
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Resumo Mensal</CardTitle>
              <CardDescription className="text-slate-300">Desempenho do mês atual</CardDescription>
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Receita Bruta</span>
<<<<<<< HEAD
                  <span className="text-white font-semibold">{formatarMoeda(caixaData.faturamentoTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Agendamentos Realizados</span>
                    <span className="text-white font-semibold">{caixaData.totalAgendamentos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Ticket Médio</span>
                <span className="text-white font-semibold">{formatarMoeda(caixaData.ticketMedio)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Taxa de Cancelamento</span>
                <span className="text-white font-semibold">{caixaData.taxaCancelamento}%</span>
=======
                <span className="text-white font-semibold">R$ 2.500,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Agendamentos Realizados</span>
                <span className="text-white font-semibold">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Ticket Médio</span>
                <span className="text-white font-semibold">R$ 55,56</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Taxa de Cancelamento</span>
                <span className="text-white font-semibold">5%</span>
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Próximos Agendamentos</CardTitle>
              <CardDescription className="text-slate-300">Agendamentos para hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">João Silva</p>
                    <p className="text-slate-400 text-sm">Corte + Barba</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">14:00</p>
                    <p className="text-amber-500 text-sm">R$ 45,00</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Pedro Santos</p>
                    <p className="text-slate-400 text-sm">Corte Simples</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">15:30</p>
                    <p className="text-amber-500 text-sm">R$ 25,00</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Carlos Lima</p>
                    <p className="text-slate-400 text-sm">Barba</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">16:00</p>
                    <p className="text-amber-500 text-sm">R$ 20,00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
<<<<<<< HEAD
        </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-300 mb-4">Erro ao carregar dados do caixa</p>
            <Button onClick={carregarDadosCaixa} className="bg-amber-500 hover:bg-amber-600 text-black">
              Tentar Novamente
            </Button>
          </div>
        )}
=======
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
      </div>
    </div>
  )
}
