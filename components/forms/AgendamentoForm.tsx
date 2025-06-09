"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import type { Barbeiro, Servico, Horario, AgendamentoForm as AgendamentoFormType } from "@/types"
import { formatarMoeda } from "@/utils/formatters"

interface AgendamentoFormProps {
  barbeiros: Barbeiro[]
  servicos: Servico[]
  horarios: Horario[]
  onSubmit: (formData: AgendamentoFormType, data: Date) => Promise<boolean>
  loading?: boolean
}


// Componente de formulário para agendamentos
export function AgendamentoForm({ barbeiros, servicos, horarios, onSubmit, loading = false }: AgendamentoFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState<AgendamentoFormType>({
    nome: "",
    contato: "",
    barbeiroId: "",
    servicoId: "",
    horarioId: "",
  })

  // Lidar com envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate) {
      toast.error("Selecione uma data para o agendamento")
      return
    }

    const sucesso = await onSubmit(formData, selectedDate)

    if (sucesso) {
      // Limpar formulário após sucesso
      setFormData({
        nome: "",
        contato: "",
        barbeiroId: "",
        servicoId: "",
        horarioId: "",
      })
      setSelectedDate(undefined)
    }
  }

  // Atualizar campo do formulário
  const atualizarCampo = (campo: keyof AgendamentoFormType, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }))
  }

  // Obter serviço selecionado para mostrar resumo
  const servicoSelecionado = servicos.find((s) => s.id === Number.parseInt(formData.servicoId))

  const disableDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // zera hora para comparação precisa

    const isPast = date < today;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6; // 0 = Domingo, 6 = Sábado

    return isPast || isWeekend;
  };

  return (
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
        <Label className="text-white">Barbeiro</Label>
        <Select value={formData.barbeiroId} onValueChange={(value) => atualizarCampo("barbeiroId", value)}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Selecione um barbeiro" />
          </SelectTrigger>
          <SelectContent>
            {barbeiros.map((barbeiro) => (
              <SelectItem key={barbeiro.id} value={barbeiro.id.toString()}>
                {barbeiro.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seleção de serviço */}
      <div className="space-y-2">
        <Label className="text-white">Serviço</Label>
        <Select value={formData.servicoId} onValueChange={(value) => atualizarCampo("servicoId", value)}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Selecione um serviço" />
          </SelectTrigger>
          <SelectContent>
            {servicos.map((servico) => (
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
        <Select value={formData.horarioId} onValueChange={(value) => atualizarCampo("horarioId", value)}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Selecione um horário" />
          </SelectTrigger>
          <SelectContent>
            {horarios.map((horario) => (
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
              disabled={disableDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Resumo do agendamento */}
      {servicoSelecionado && (
        <div className="p-4 bg-slate-700 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Resumo do Agendamento</h3>
          <p className="text-slate-300">Serviço: {servicoSelecionado.descricao}</p>
          <p className="text-slate-300">Valor: {formatarMoeda(servicoSelecionado.valor)}</p>
        </div>
      )}

      {/* Botão de envio */}
      <Button
        type="submit"
        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        disabled={loading}
      >
        {loading ? "Agendando..." : "Confirmar Agendamento"}
      </Button>
    </form>
  )
}
