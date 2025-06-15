"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Users, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { formatarMoeda } from "@/utils/formatters"
import { AgendamentosDia } from "@/components/caixa/AgendamentosDia"
import { AgendamentoResponse, ServicoMaisVendido } from "@/types"
import { caixaService } from "@/services/api"

// Interface para o response do faturamento total
interface FaturamentoTotalResponse {
  valor: number
}

interface TotalAgendamentoResponse {
  valor: number
}

interface ServicoMaisVendidoResponse {
  descricaoDoServico: string
}

// Interface para dados consolidados do caixa
interface CaixaData {
  faturamentoTotal: FaturamentoTotalResponse | number
  totalAgendamentos: TotalAgendamentoResponse | number
  agendamentosHoje: number
  servicoMaisVendido: ServicoMaisVendido | string
  ticketMedio: number
  taxaCancelamento: number
}

export default function CaixaPage() {
  const [caixaData, setCaixaData] = useState<CaixaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [proximosAgendamentos, setProximosAgendamentos] = useState<AgendamentoResponse[]>([])

  const [loadingProximosAgendamentos, setLoadingProximosAgendamentos] = useState(false)


  //fazer o ticket medio no front o back ja ta pronto 

  useEffect(() => {
    carregarDadosCaixa()
  }, [])
  // Carregar faturamento total da API
  const carregarFaturamentoTotal = async (): Promise<FaturamentoTotalResponse | number> => {
    try {
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
    }
  }

   const carregarTotalAgendamentos = async (): Promise<TotalAgendamentoResponse | number> => {
    try {
      const response = await fetch("http://localhost:8080/caixas/total-agendamentos")

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data: TotalAgendamentoResponse = await response.json()
      return data
    } catch (error) {
      console.error("Erro ao carregar total de agendamento:", error)
      toast.error("Erro ao carregar total de agendamento")
      return 0
    }
  }

  const carregarServicoMaisVendido = async (): Promise<ServicoMaisVendido | string> => {
    try {
      const response = await fetch("http://localhost:8080/caixas/servico-vendidos")

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data: ServicoMaisVendido[] = await response.json()
      return data[0]
    } catch (error) {
      console.error("Erro ao carregar servico mais agendado:", error)
      toast.error("Erro ao carregar servico mais agendados")
      return ''
    } 
  }

  const carregarProximosAgendamentosHoje = async () => {
    try {
      setLoadingProximosAgendamentos(true)
      const data = await caixaService.proximosAgendamentosHoje()
      setProximosAgendamentos(data)
    } catch (error) {
      console.error("Erro ao carregar próximos agendamentos de hoje:", error)
      toast.error("Erro ao carregar próximos agendamentos")
      setProximosAgendamentos([])
    } finally {
      setLoadingProximosAgendamentos(false)
    }
  }

  const carregarTicketMedio = async (): Promise<number> => {
    try {
      const response = await fetch("http://localhost:8080/caixas/ticket-medio")

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data: number = await response.json()
      return data

    } catch(error) {
      console.error("Erro ao carregar ticket medio:", error)
      toast.error("Erro ao carregar ticket medio")
      return 0
    }
  }



  // Carregar outros dados do caixa (simulados por enquanto)
  const carregarOutrosDados = async () => {
    try {
      return {
        agendamentosHoje: 0,
        taxaCancelamento: 0,
      }
    } catch (error) {
      console.error("Erro ao carregar outros dados:", error)
      return {
        agendamentosHoje: 0,
        taxaCancelamento: 0,
      }
    }
  }

  // Carregar todos os dados do caixa
  const carregarDadosCaixa = async () => {
    try {
      setLoading(true)

      // Carregar dados em paralelo
      const [faturamentoTotal, totalAgendamentos, servicoMaisVendido, ticketMedio, outrosDados] = await Promise.all([
        carregarFaturamentoTotal(), 
        carregarTotalAgendamentos(), 
        carregarServicoMaisVendido(), 
        carregarTicketMedio(),
        carregarOutrosDados(),
        carregarProximosAgendamentosHoje(), 
      ])

      setCaixaData({
      faturamentoTotal,
      totalAgendamentos,
      servicoMaisVendido,
      ticketMedio,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
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

        <div className="flex space-x-2">

            <Button
              onClick={carregarDadosCaixa}
              variant="outline"
              className="border-slate-600 text-black hover:bg-slate-700"
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{
                typeof caixaData.faturamentoTotal === 'number'?formatarMoeda(caixaData.faturamentoTotal):formatarMoeda(caixaData.faturamentoTotal.valor)}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total de Agendamentos</CardTitle>
                <Calendar className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{typeof caixaData.totalAgendamentos === 'number'?caixaData.totalAgendamentos:caixaData.totalAgendamentos.valor}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Agendamentos Hoje</CardTitle>
                <Users className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{proximosAgendamentos.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Serviço Mais Vendido</CardTitle>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{typeof caixaData.servicoMaisVendido === 'string'?caixaData.servicoMaisVendido:caixaData.servicoMaisVendido.descricaoDoServico}</div>
              </CardContent>
            </Card>
          </div>

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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Receita Bruta</span>
                  <span className="text-white font-semibold">{typeof caixaData.faturamentoTotal === 'number'?formatarMoeda(caixaData.faturamentoTotal):formatarMoeda(caixaData.faturamentoTotal.valor)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Agendamentos Realizados</span>
                    <span className="text-white font-semibold">{typeof caixaData.totalAgendamentos === 'number'?caixaData.totalAgendamentos:caixaData.totalAgendamentos.valor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Ticket Médio</span>
                <span className="text-white font-semibold">{formatarMoeda(caixaData.ticketMedio)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Taxa de Cancelamento</span>
                <span className="text-white font-semibold">{caixaData.taxaCancelamento}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Próximos Agendamentos</CardTitle>
                  <CardDescription className="text-slate-300">Agendamentos para hoje</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingProximosAgendamentos ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mx-auto"></div>
                      <p className="text-slate-300 text-sm mt-2">Carregando próximos agendamentos...</p>
                    </div>
                  ) : proximosAgendamentos.length > 0 ? (
                    <div className="space-y-3">
                      {proximosAgendamentos.map((agendamento) => (
                        <div
                          key={agendamento.id}
                          className="flex justify-between items-center p-3 bg-slate-700 rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">{agendamento.nome}</p>
                            <p className="text-slate-400 text-sm">{agendamento.registroServico.descricao}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">{agendamento.registroHorario.horarioInicio}</p>
                            <p className="text-amber-500 text-sm">{formatarMoeda(agendamento.valor)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-slate-300">Nenhum próximo agendamento para hoje.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-300 mb-4">Erro ao carregar dados do caixa</p>
            <Button onClick={carregarDadosCaixa} className="bg-amber-500 hover:bg-amber-600 text-black">
              Tentar Novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}