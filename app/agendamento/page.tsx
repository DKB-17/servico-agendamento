"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import Link from "next/link"
import { barbeiroService } from "@/services/api"
import { formatarMoeda } from "@/utils/formatters"
import type { Barbeiro, Servico, Horario } from "@/types"

// Interface para o response da criação de agenda
interface AgendaResponse {
  id: number
  nome: string
  contato: string
  registroHorario: {
    id: number
    horarioInicio: string
    horarioFim: string
  }
  registroServico: {
    id: number
    descricao: string
    valor: number
  }
  registroBarbeiro: {
    id: number
    nome: string
    caminhoImagem?: string | null
  }
  dia: string
  valor: number
  etapa: string
}

// Página de agendamento público
export default function AgendamentoPage() {
  // Estados para dados
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([])
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<Horario[]>([])

  // Estados do formulário
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    nome: "",
    contato: "",
    barbeiroId: "",
    servicoId: "",
    horarioId: "",
  })

  // Estados de controle
  const [loading, setLoading] = useState(false)
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(true)

  // Carregar barbeiros ao montar o componente
  useEffect(() => {
    carregarBarbeiros()
  }, [])

  // Carregar lista de barbeiros
  const carregarBarbeiros = async () => {
    try {
      setLoadingBarbeiros(true)
      const data = await barbeiroService.listar()
      setBarbeiros(data)
    } catch (error) {
      toast.error("Erro ao carregar barbeiros")
      console.error("Erro ao carregar barbeiros:", error)
    } finally {
      setLoadingBarbeiros(false)
    }
  }

  // Quando barbeiro for selecionado, carregar seus serviços e horários
  const handleBarbeiroChange = (barbeiroId: string) => {
    setFormData((prev) => ({
      ...prev,
      barbeiroId,
      servicoId: "", // Limpar seleções anteriores
      horarioId: "",
    }))

    if (barbeiroId) {
      const barbeiroSelecionado = barbeiros.find((b) => b.id === Number.parseInt(barbeiroId))
      if (barbeiroSelecionado) {
        setServicosDisponiveis(barbeiroSelecionado.servicos)
        setHorariosDisponiveis(barbeiroSelecionado.horarios)
      }
    } else {
      setServicosDisponiveis([])
      setHorariosDisponiveis([])
    }
  }

  // Atualizar outros campos do formulário
  const atualizarCampo = (campo: keyof typeof formData, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }))
  }

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate) {
      toast.error("Selecione uma data para o agendamento")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/agendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          contato: formData.contato,
          barbeiroId: Number.parseInt(formData.barbeiroId),
          servicoId: Number.parseInt(formData.servicoId),
          horarioId: Number.parseInt(formData.horarioId),
          dia: selectedDate.toISOString(),
        }),
      })

      if (response.ok) {
        const agendaCriada: AgendaResponse = await response.json()

        // Mostrar notificação de sucesso com informações relevantes
        toast.success(
          `Agendamento realizado com sucesso! 
          Cliente: ${agendaCriada.nome}
          Barbeiro: ${agendaCriada.registroBarbeiro.nome}
          Serviço: ${agendaCriada.registroServico.descricao}
          Horário: ${agendaCriada.registroHorario.horarioInicio} - ${agendaCriada.registroHorario.horarioFim}
          Valor: ${formatarMoeda(agendaCriada.valor)}`,
          { duration: 8000 },
        )

        // Limpar formulário
        setFormData({
          nome: "",
          contato: "",
          barbeiroId: "",
          servicoId: "",
          horarioId: "",
        })
        setSelectedDate(undefined)
        setServicosDisponiveis([])
        setHorariosDisponiveis([])
      } else {
        toast.error("Erro ao realizar agendamento")
      }
    } catch (error) {
      toast.error("Erro ao realizar agendamento")
      console.error("Erro ao criar agendamento:", error)
    } finally {
      setLoading(false)
    }
  }

  // Obter serviço selecionado para mostrar resumo
  const servicoSelecionado = servicosDisponiveis.find((s) => s.id === Number.parseInt(formData.servicoId))
  const horarioSelecionado = horariosDisponiveis.find((h) => h.id === Number.parseInt(formData.horarioId))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-amber-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Agendar Serviço</h1>
          <p className="text-slate-300">Preencha os dados abaixo para realizar seu agendamento</p>
        </div>

        <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Novo Agendamento</CardTitle>
            <CardDescription className="text-slate-300">
              Escolha o barbeiro primeiro, depois selecione o serviço, horário e data desejados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-white">
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => atualizarCampo("nome", e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contato" className="text-white">
                    Telefone
                  </Label>
                  <Input
                    id="contato"
                    value={formData.contato}
                    onChange={(e) => atualizarCampo("contato", e.target.value)}
                    placeholder="(18) 99999-9999"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Seleção de barbeiro */}
              <div className="space-y-2">
                <Label className="text-white">Barbeiro *</Label>
                <Select value={formData.barbeiroId} onValueChange={handleBarbeiroChange} disabled={loadingBarbeiros}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder={loadingBarbeiros ? "Carregando barbeiros..." : "Selecione um barbeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    {barbeiros.map((barbeiro) => (
                      <SelectItem key={barbeiro.id} value={barbeiro.id.toString()}>
                        {barbeiro.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-400">
                  Primeiro selecione o barbeiro para ver os serviços e horários disponíveis
                </p>
              </div>

              {/* Seleção de serviço */}
              <div className="space-y-2">
                <Label className="text-white">Serviço</Label>
                <Select
                  value={formData.servicoId}
                  onValueChange={(value) => atualizarCampo("servicoId", value)}
                  disabled={!formData.barbeiroId || servicosDisponiveis.length === 0}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue
                      placeholder={
                        !formData.barbeiroId
                          ? "Selecione um barbeiro primeiro"
                          : servicosDisponiveis.length === 0
                            ? "Nenhum serviço disponível"
                            : "Selecione um serviço"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {servicosDisponiveis.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id.toString()}>
                        {servico.descricao} - {formatarMoeda(servico.valor)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seleção de horário */}
              <div className="space-y-2">
                <Label className="text-white">Horário</Label>
                <Select
                  value={formData.horarioId}
                  onValueChange={(value) => atualizarCampo("horarioId", value)}
                  disabled={!formData.barbeiroId || horariosDisponiveis.length === 0}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue
                      placeholder={
                        !formData.barbeiroId
                          ? "Selecione um barbeiro primeiro"
                          : horariosDisponiveis.length === 0
                            ? "Nenhum horário disponível"
                            : "Selecione um horário"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {horariosDisponiveis.map((horario) => (
                      <SelectItem key={horario.id} value={horario.id.toString()}>
                        {horario.horarioInicio} - {horario.horarioFim}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seleção de data */}
              <div className="space-y-2">
                <Label className="text-white">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Resumo do agendamento */}
              {servicoSelecionado && horarioSelecionado && (
                <div className="p-4 bg-slate-700 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Resumo do Agendamento</h3>
                  <div className="space-y-1 text-slate-300">
                    <p>Barbeiro: {barbeiros.find((b) => b.id === Number.parseInt(formData.barbeiroId))?.nome}</p>
                    <p>Serviço: {servicoSelecionado.descricao}</p>
                    <p>
                      Horário: {horarioSelecionado.horarioInicio} - {horarioSelecionado.horarioFim}
                    </p>
                    <p className="text-amber-400 font-medium">Valor: {formatarMoeda(servicoSelecionado.valor)}</p>
                  </div>
                </div>
              )}

              {/* Botão de envio */}
              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                disabled={
                  loading || !formData.barbeiroId || !formData.servicoId || !formData.horarioId || !selectedDate
                }
              >
                {loading ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
