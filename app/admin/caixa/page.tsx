"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface CaixaData {
  totalFaturamento: number
  totalAgendamentos: number
  agendamentosHoje: number
  servicoMaisVendido: string
}

export default function CaixaPage() {
  const [caixaData, setCaixaData] = useState<CaixaData | null>(null)

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
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Resumo Mensal</CardTitle>
              <CardDescription className="text-slate-300">Desempenho do mês atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Receita Bruta</span>
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
      </div>
    </div>
  )
}
