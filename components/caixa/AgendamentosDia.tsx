"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { caixaService } from "@/services/api"
import type { AgendamentosDiaResponse } from "@/types"

export function AgendamentosDia() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [agendamentosDia, setAgendamentosDia] = useState<AgendamentosDiaResponse | null>(null)
  const [loading, setLoading] = useState(false)

  // Buscar agendamentos para a data selecionada
  const buscarAgendamentosDia = async (data: Date) => {
    try {
      setLoading(true)
      const resultado = await caixaService.agendamentosPorDia(data)
      setAgendamentosDia(resultado)
      toast.success(`Agendamentos para ${format(data, "dd/MM/yyyy")} carregados com sucesso!`)
    } catch (error) {
      console.error("Erro ao buscar agendamentos por dia:", error)
      toast.error(`Erro ao buscar agendamentos para ${format(data, "dd/MM/yyyy")}`)
      setAgendamentosDia(null)
    } finally {
      setLoading(false)
    }
  }

  // Quando a data for alterada
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      buscarAgendamentosDia(date)
    }
  }

  // Total de agendamentos
  const totalAgendamentos = agendamentosDia
    ? agendamentosDia.agendasPendentes +
      agendamentosDia.agendasConfirmados +
      agendamentosDia.agendasCancelados +
      agendamentosDia.agendasConcluidos
    : 0

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Agendamentos por Dia</CardTitle>
            <CardDescription className="text-slate-300">Resumo de agendamentos para a data selecionada</CardDescription>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700 flex items-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus locale={ptBR} />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : agendamentosDia ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Pendentes</span>
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">{agendamentosDia.agendasPendentes}</div>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Confirmados</span>
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{agendamentosDia.agendasConfirmados}</div>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Cancelados</span>
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="text-2xl font-bold text-white">{agendamentosDia.agendasCancelados}</div>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Concluídos</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{agendamentosDia.agendasConcluidos}</div>
              </div>
            </div>

            {/* Gráfico de barras simples */}
            <div className="mt-6">
              <div className="text-sm text-slate-300 mb-2">Distribuição de agendamentos</div>
              <div className="h-8 w-full bg-slate-700 rounded-lg overflow-hidden flex">
                {totalAgendamentos > 0 ? (
                  <>
                    {agendamentosDia.agendasPendentes > 0 && (
                      <div
                        className="bg-yellow-500 h-full"
                        style={{
                          width: `${(agendamentosDia.agendasPendentes / totalAgendamentos) * 100}%`,
                        }}
                        title={`Pendentes: ${agendamentosDia.agendasPendentes}`}
                      ></div>
                    )}
                    {agendamentosDia.agendasConfirmados > 0 && (
                      <div
                        className="bg-blue-500 h-full"
                        style={{
                          width: `${(agendamentosDia.agendasConfirmados / totalAgendamentos) * 100}%`,
                        }}
                        title={`Confirmados: ${agendamentosDia.agendasConfirmados}`}
                      ></div>
                    )}
                    {agendamentosDia.agendasCancelados > 0 && (
                      <div
                        className="bg-red-500 h-full"
                        style={{
                          width: `${(agendamentosDia.agendasCancelados / totalAgendamentos) * 100}%`,
                        }}
                        title={`Cancelados: ${agendamentosDia.agendasCancelados}`}
                      ></div>
                    )}
                    {agendamentosDia.agendasConcluidos > 0 && (
                      <div
                        className="bg-green-500 h-full"
                        style={{
                          width: `${(agendamentosDia.agendasConcluidos / totalAgendamentos) * 100}%`,
                        }}
                        title={`Concluídos: ${agendamentosDia.agendasConcluidos}`}
                      ></div>
                    )}
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center text-xs text-slate-400">
                    Nenhum agendamento para esta data
                  </div>
                )}
              </div>

              {/* Legenda */}
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                  <span className="text-xs text-slate-300">Pendentes</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <span className="text-xs text-slate-300">Confirmados</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                  <span className="text-xs text-slate-300">Cancelados</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                  <span className="text-xs text-slate-300">Concluídos</span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-slate-400 mt-4">
              Total: {totalAgendamentos} agendamento{totalAgendamentos !== 1 ? "s" : ""} para{" "}
              {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-300 mb-4">Selecione uma data para ver os agendamentos</p>
            <Button
              onClick={() => buscarAgendamentosDia(selectedDate)}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              Buscar Agendamentos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
