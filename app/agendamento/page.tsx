"use client"

import { Label } from "@/components/ui/label"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import Link from "next/link"
import { barbeiroService, agendamentoService, horarioService } from "@/services/api"
import { formatarMoeda, formatarTelefone } from "@/utils/formatters"
import type { Barbeiro, Servico, Horario, AgendamentoResponse } from "@/types"


// Definição dos passos do agendamento
enum SchedulingStep {
  WELCOME = 0,
  WHATSAPP = 1,
  SELECT_BARBER = 2,
  SELECT_SERVICE = 3,
  SELECT_DATE = 4,
  SELECT_TIME = 5,
  ENTER_NAME = 6,
  CONFIRMATION = 7,
}

export default function AgendamentoPage() {
  // Estados para dados
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([])
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<Horario[]>([])

  // Estados do formulário
  const [currentStep, setCurrentStep] = useState<SchedulingStep>(SchedulingStep.WELCOME)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    nome: "",
    contato: "",
    barbeiroId: "",
    servicoId: "",
    horarioId: "",
  })
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState<AgendamentoResponse | null>()

  // Estados de controle
  const [loading, setLoading] = useState(false)
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(true)
  const [loadingHorariosDisponiveis, setLoadingHorariosDisponiveis] = useState(false)

  // Carregar barbeiros ao montar o componente
  useEffect(() => {
    carregarBarbeiros()
  }, [])

  useEffect(() => {
    const fetchHorarios = async () => {
      if (formData.barbeiroId && selectedDate) {
        setLoadingHorariosDisponiveis(true)
        try {
          const horarios = await horarioService.horariosDisponiveis(selectedDate, Number.parseInt(formData.barbeiroId))
          setHorariosDisponiveis(horarios)
        } catch (error) {
          toast.error("Erro ao carregar horários disponíveis para este barbeiro e data.")
          console.error("Erro ao carregar horários disponíveis:", error)
          setHorariosDisponiveis([])
        } finally {
          setLoadingHorariosDisponiveis(false)
        }
      } else {
        setHorariosDisponiveis([]) // Limpar horários se não houver barbeiro ou data
      }
      setFormData((prev) => ({ ...prev, horarioId: "" })) // Limpar horário selecionado
    }

    fetchHorarios()
  }, [formData.barbeiroId, selectedDate])

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

  // Lidar com a seleção do barbeiro
  const handleBarbeiroSelect = (barbeiroId: string) => {
    setFormData((prev) => ({
      ...prev,
      barbeiroId: barbeiroId,
      servicoId: "",
      horarioId: "",
    }))
    const barbeiroSelecionado = barbeiros.find((b) => b.id.toString() === barbeiroId)
    if (barbeiroSelecionado) {
      setServicosDisponiveis(barbeiroSelecionado.servicos)
      setHorariosDisponiveis(barbeiroSelecionado.horarios)
    }
  }

  // Lidar com a seleção do serviço
  const handleServicoSelect = (servicoId: string) => {
    setFormData((prev) => ({
      ...prev,
      servicoId: servicoId,
    }))
  }

  // Lidar com a seleção da data
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setFormData((prev) => ({ ...prev, horarioId: "" }))
  }

  // Lidar com a seleção do horário
  const handleHorarioSelect = (horarioId: string) => {
    setFormData((prev) => ({
      ...prev,
      horarioId: horarioId,
    }))
  }

  // Atualizar campo do formulário
  const atualizarCampo = (campo: keyof typeof formData, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }))
  }

  // Enviar formulário de agendamento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate) {
      toast.error("Selecione uma data para o agendamento")
      return
    }

    setLoading(true)

    try {
      const response = await agendamentoService.criar(
        {
          nome: formData.nome,
          contato: formData.contato,
          barbeiroId: Number.parseInt(formData.barbeiroId),
          servicoId: Number.parseInt(formData.servicoId),
          horarioId: Number.parseInt(formData.horarioId),
          dia: selectedDate.toISOString(),
        },
        selectedDate,
      )

      if (response) {
        setAgendamentoConfirmado(response)
        toast.success("Agendamento realizado com sucesso!", { duration: 5000 })
        setCurrentStep(SchedulingStep.CONFIRMATION)
      } else {
        toast.error("Erro ao realizar agendamento")
        setAgendamentoConfirmado(null)
      }
    } catch (error) {
      toast.error("Erro ao realizar agendamento")
      console.error("Erro ao criar agendamento:", error)
    } finally {
      setLoading(false)
    }
  }

  // Reiniciar o processo de agendamento
  const handleRestart = () => {
    setCurrentStep(SchedulingStep.WELCOME)
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
    setAgendamentoConfirmado(undefined)
    carregarBarbeiros() // Recarregar barbeiros caso algo tenha mudado
  }

  // Obter serviço selecionado para mostrar resumo
  const servicoSelecionado = servicosDisponiveis.find((s) => s.id === Number.parseInt(formData.servicoId))
  const horarioSelecionado = horariosDisponiveis.find((h) => h.id === Number.parseInt(formData.horarioId))
  const barbeiroSelecionado = barbeiros.find((b) => b.id === Number.parseInt(formData.barbeiroId))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-3xl font-bold text-amber-500">
              Costa
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black">
                Área Administrativa
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho da página */}
        <div className="mb-6 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-amber-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleRestart}
            className="border-slate-600 text-white hover:bg-slate-700 rounded-full p-2"
            title="Reiniciar Agendamento"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-700 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-white">Agendar Serviço</CardTitle>
            <CardDescription className="text-slate-300">
              Siga os passos para marcar seu horário na Barbearia do Costa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Chatbot Interface */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Mensagem de boas-vindas */}
              <div className="flex justify-start">
                <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[80%]">
                  <p>Olá, tudo bem? Sou o secretário virtual da Barbearia do Costa.</p>
                  <p>Vou te ajudar a marcar um novo horário, vamos lá?</p>
                  {currentStep === SchedulingStep.WELCOME && (
                    <Button
                      onClick={() => setCurrentStep(SchedulingStep.WHATSAPP)}
                      className="mt-2 bg-amber-500 hover:bg-amber-600 text-black w-full"
                    >
                      Começar
                    </Button>
                  )}
                </div>
              </div>

              {/* Passo 1: WhatsApp */}
              {(currentStep >= SchedulingStep.WHATSAPP || agendamentoConfirmado) && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[80%]">
                    <p>
                      Informe o seu número do WhatsApp, para que o estabelecimento possa entrar em contato com você:
                    </p>
                    <div className="mt-2 space-y-2">
                      <Label htmlFor="contato" className="sr-only">
                        Telefone
                      </Label>
                      <Input
                        id="contato"
                        value={formData.contato}
                        onChange={(e) => atualizarCampo("contato", e.target.value)}
                        placeholder="Ex: (18) 99999-9999"
                        required
                        className="bg-slate-600 border-slate-500 text-white"
                        disabled={currentStep > SchedulingStep.WHATSAPP && !agendamentoConfirmado}
                      />
                      {currentStep === SchedulingStep.WHATSAPP && (
                        <Button
                          onClick={() => {
                            if (formData.contato) {
                              setCurrentStep(SchedulingStep.SELECT_BARBER)
                            } else {
                              toast.error("Por favor, informe seu número de WhatsApp.")
                            }
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-black w-full"
                        >
                          Continuar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Passo 2: Seleção de Barbeiro */}
              {(currentStep >= SchedulingStep.SELECT_BARBER || agendamentoConfirmado) && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[80%]">
                    <p>Selecione um barbeiro:</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {loadingBarbeiros ? (
                        <p className="text-slate-400 col-span-2">Carregando barbeiros...</p>
                      ) : barbeiros.length > 0 ? (
                        barbeiros.map((barbeiro) => (
                          <Button
                            key={barbeiro.id}
                            onClick={() => handleBarbeiroSelect(barbeiro.id.toString())}
                            variant={formData.barbeiroId === barbeiro.id.toString() ? "default" : "outline"}
                            className={
                              formData.barbeiroId === barbeiro.id.toString()
                                ? "bg-amber-500 hover:bg-amber-600 text-black"
                                : "border-slate-600 text-black hover:bg-slate-700"
                            }
                            disabled={currentStep > SchedulingStep.SELECT_BARBER && !agendamentoConfirmado}
                          >
                            {barbeiro.nome}
                          </Button>
                        ))
                      ) : (
                        <p className="text-slate-400 col-span-2">Nenhum barbeiro disponível.</p>
                      )}
                    </div>
                    {currentStep === SchedulingStep.SELECT_BARBER && (
                      <Button
                        onClick={() => setCurrentStep(SchedulingStep.SELECT_SERVICE)}
                        disabled={!formData.barbeiroId}
                        className="mt-2 bg-amber-500 hover:bg-amber-600 text-black w-full"
                      >
                        Continuar
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Passo 3: Seleção de Serviço */}
              {(currentStep >= SchedulingStep.SELECT_SERVICE || agendamentoConfirmado) &&
                formData.barbeiroId &&
                servicosDisponiveis.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[80%]">
                      <p>Selecione um de nossos serviços:</p>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {servicosDisponiveis.map((servico) => (
                          <Button
                            key={servico.id}
                            onClick={() => handleServicoSelect(servico.id.toString())}
                            variant={formData.servicoId === servico.id.toString() ? "default" : "outline"}
                            className={
                              formData.servicoId === servico.id.toString()
                                ? "bg-amber-500 hover:bg-amber-600 text-black justify-between"
                                : "border-slate-600 text-black hover:bg-slate-700 justify-between"
                            }
                            disabled={currentStep > SchedulingStep.SELECT_SERVICE && !agendamentoConfirmado}
                          >
                            <span>{servico.descricao}</span>
                            <span className="font-bold">{formatarMoeda(servico.valor)}</span>
                          </Button>
                        ))}
                      </div>
                      {currentStep === SchedulingStep.SELECT_SERVICE && (
                        <Button
                          onClick={() => setCurrentStep(SchedulingStep.SELECT_DATE)}
                          disabled={!formData.servicoId}
                          className="mt-2 bg-amber-500 hover:bg-amber-600 text-black w-full"
                        >
                          Continuar
                        </Button>
                      )}
                    </div>
                  </div>
                )}

              {/* Passo 4: Seleção de Data */}
              {(currentStep >= SchedulingStep.SELECT_DATE || agendamentoConfirmado) && formData.servicoId && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[80%]">
                    <p>Qual dia você deseja agendar?</p>
                    <div className="mt-2 space-y-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                            disabled={currentStep > SchedulingStep.SELECT_DATE && !agendamentoConfirmado}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      {currentStep === SchedulingStep.SELECT_DATE && (
                        <Button
                          onClick={() => setCurrentStep(SchedulingStep.SELECT_TIME)}
                          disabled={!selectedDate}
                          className="bg-amber-500 hover:bg-amber-600 text-black w-full"
                        >
                          Continuar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Passo 5: Seleção de Horário */}
              {(currentStep >= SchedulingStep.SELECT_TIME || agendamentoConfirmado) &&
                selectedDate &&
                formData.barbeiroId && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[80%]">
                      <p>Escolha um horário:</p>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {loadingHorariosDisponiveis ? (
                          <p className="text-slate-400 col-span-3">Carregando horários disponíveis...</p>
                        ) : horariosDisponiveis.length > 0 ? (
                          horariosDisponiveis.map((horario) => (
                          <Button
                            key={horario.id}
                            onClick={() => handleHorarioSelect(horario.id.toString())}
                            variant={formData.horarioId === horario.id.toString() ? "default" : "outline"}
                            className={
                              formData.horarioId === horario.id.toString()
                                ? "bg-amber-500 hover:bg-amber-600 text-black"
                                : "border-slate-600 text-black hover:bg-slate-700"
                            }
                            disabled={currentStep > SchedulingStep.SELECT_TIME && !agendamentoConfirmado}
                          >
                            {horario.horarioInicio.substring(0, 5)}
                          </Button>
                        ))) : (
                          <p className="text-slate-400 col-span-3">
                            Nenhum horário disponível para esta data e barbeiro.
                          </p>
                        )}
                      </div>
                      {currentStep === SchedulingStep.SELECT_TIME && (
                        <Button
                          onClick={() => setCurrentStep(SchedulingStep.ENTER_NAME)}
                          disabled={!formData.horarioId}
                          className="mt-2 bg-amber-500 hover:bg-amber-600 text-black w-full"
                        >
                          Continuar
                        </Button>
                      )}
                    </div>
                  </div>
                )}

              {/* Passo 6: Nome Completo */}
              {(currentStep >= SchedulingStep.ENTER_NAME || agendamentoConfirmado) && formData.horarioId && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[80%]">
                    <p>Estamos quase finalizando, por favor, informe seu nome completo:</p>
                    <div className="mt-2 space-y-2">
                      <Label htmlFor="nome" className="sr-only">
                        Nome completo
                      </Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => atualizarCampo("nome", e.target.value)}
                        placeholder="Nome completo"
                        required
                        className="bg-slate-600 border-slate-500 text-white"
                        disabled={currentStep > SchedulingStep.ENTER_NAME && !agendamentoConfirmado}
                      />
                      {currentStep === SchedulingStep.ENTER_NAME && (
                        <Button
                          onClick={handleSubmit}
                          disabled={loading || !formData.nome}
                          className="bg-amber-500 hover:bg-amber-600 text-black w-full"
                        >
                          {loading ? "Agendando..." : "Confirmar Agendamento"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Passo 7: Confirmação */}
              {agendamentoConfirmado && (
                <div className="flex justify-end">
                  <div className="bg-green-700 text-white p-4 rounded-lg max-w-[80%]">
                    <p className="font-bold text-lg mb-2">✔ Agendamento realizado com sucesso!</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        Data:{" "}
                        <span className="font-medium">
                          {format(new Date(agendamentoConfirmado.dia), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </p>
                      <p>
                        Horário:{" "}
                        <span className="font-medium">
                          {agendamentoConfirmado.registroHorario.horarioInicio.substring(0, 5)}
                        </span>
                      </p>
                      <p>
                        Em nome de: <span className="font-medium">{agendamentoConfirmado.nome}</span>
                      </p>
                      <p>
                        Profissional: <span className="font-medium">{agendamentoConfirmado.registroBarbeiro.nome}</span>
                      </p>
                      <p>
                        Serviço: <span className="font-medium">{agendamentoConfirmado.registroServico.descricao}</span>
                      </p>
                      <p>
                        Valor: <span className="font-medium">{formatarMoeda(agendamentoConfirmado.valor)}</span>
                      </p>
                      <p>
                        Contato: <span className="font-medium">{formatarTelefone(agendamentoConfirmado.contato)}</span>
                      </p>
                      <p className="text-xs text-slate-200 mt-2">
                        Endereço: Av. Mário de Vito, Jardim Nossa Senhora de Fátima, RES. DANUSA
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

