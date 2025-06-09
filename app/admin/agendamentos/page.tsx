"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Edit2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { formatarMoeda } from "@/utils/formatters"
import { filterService } from "@/services/filterService"
import { FilterComponent } from "@/components/filters/FilterComponent"

// Interface atualizada para o novo formato de resposta
interface AgendamentoAtualizado {
  id: number
  nome: string
  contato: string
  registroHorario: {
    id: number
    horarioInicio: string
    horarioFim: string
    deletedAt?: string | null
    createdAt: string
    updatedAt: string
  }
  registroServico: {
    id: number
    descricao: string
    valor: number
    createdAt: string
    updatedAt: string
  }
  registroBarbeiro: {
    id: number
    nome: string
    caminhoImagem?: string | null
    createdAt: string
    updatedAt: string
  }
  dia: string
  valor: number
  etapa: string
}

// Tipos de etapas disponíveis
type EtapaType = "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO"

// Configuração das etapas
const ETAPAS_CONFIG = {
  PENDENTE: {
    label: "Pendente",
    color: "bg-yellow-500/20 text-yellow-300",
    description: "Aguardando confirmação",
  },
  CONFIRMADO: {
    label: "Confirmado",
    color: "bg-green-500/20 text-green-300",
    description: "Agendamento confirmado",
  },
  CANCELADO: {
    label: "Cancelado",
    color: "bg-red-500/20 text-red-300",
    description: "Agendamento cancelado",
  },
  CONCLUIDO: {
    label: "Concluído",
    color: "bg-blue-500/20 text-blue-300",
    description: "Serviço realizado",
  },
} as const

// Configuração dos campos de filtro para agendamentos
const AGENDAMENTO_FILTER_FIELDS = [
  { key: "id", label: "ID", type: "number" as const, placeholder: "Ex: 1" },
  { key: "nome", label: "Nome do Cliente", type: "text" as const, placeholder: "Ex: João Silva" },
  { key: "contato", label: "Contato", type: "text" as const, placeholder: "Ex: (18) 99999-9999" },
  { key: "dia", label: "Data do Agendamento", type: "date" as const },
  { key: "valor", label: "Valor", type: "number" as const, placeholder: "Ex: 25.00" },
  {
    key: "etapa",
    label: "Etapa",
    type: "select" as const,
    options: [
      { value: "PENDENTE", label: "Pendente" },
      { value: "CONFIRMADO", label: "Confirmado" },
      { value: "CANCELADO", label: "Cancelado" },
      { value: "CONCLUIDO", label: "Concluído" },
    ],
  },
]

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoAtualizado[]>([])
  const [agendamentosOriginais, setAgendamentosOriginais] = useState<AgendamentoAtualizado[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLoading, setFilterLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  // Estados para o dialog de atualização
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAgendamento, setSelectedAgendamento] = useState<AgendamentoAtualizado | null>(null)
  const [novaEtapa, setNovaEtapa] = useState<EtapaType>("PENDENTE")

  useEffect(() => {
    fetchAgendamentos()
  }, [])

  const fetchAgendamentos = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/agendas")
      const data = await response.json()
      setAgendamentos(data)
      setAgendamentosOriginais(data)
    } catch (error) {
      toast.error("Erro ao carregar agendamentos")
      console.error("Erro ao carregar agendamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  
  // Aplicar filtros
  const aplicarFiltros = async (filters: Record<string, any>) => {
    setFilterLoading(true)
    try {
      const agendamentosFilterados = await filterService.filtrar<AgendamentoAtualizado>("agendas", filters)
      setAgendamentos(agendamentosFilterados)
      toast.success(`${agendamentosFilterados.length} agendamento(s) encontrado(s)`)
    } catch (error) {
      toast.error("Erro ao aplicar filtros")
      console.error("Erro ao filtrar agendamentos:", error)
    } finally {
      setFilterLoading(false)
    }
  }

  // Limpar filtros
  const limparFiltros = () => {
    setAgendamentos(agendamentosOriginais)
    toast.success("Filtros removidos")
  }

  // Abrir dialog para atualizar etapa
  const abrirDialogAtualizacao = (agendamento: AgendamentoAtualizado) => {
    setSelectedAgendamento(agendamento)
    setNovaEtapa(agendamento.etapa as EtapaType)
    setIsDialogOpen(true)
  }

  // Fechar dialog
  const fecharDialog = () => {
    setIsDialogOpen(false)
    setSelectedAgendamento(null)
  }

  // Atualizar etapa do agendamento
  const atualizarEtapa = async () => {
    if (!selectedAgendamento) return

    try {
      setUpdatingId(selectedAgendamento.id)

      const response = await fetch(`http://localhost:8080/agendas/${selectedAgendamento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          etapa: novaEtapa,
        }),
      })

      if (response.ok) {
        toast.success(`Etapa atualizada para "${ETAPAS_CONFIG[novaEtapa].label}" com sucesso!`)
        await fetchAgendamentos() // Recarregar dados
        fecharDialog()
      } else {
        toast.error("Erro ao atualizar etapa do agendamento")
      }
    } catch (error) {
      toast.error("Erro ao atualizar etapa do agendamento")
      console.error("Erro ao atualizar etapa:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  // Atualização rápida de etapa (sem dialog)
  const atualizacaoRapida = async (agendamento: AgendamentoAtualizado, novaEtapa: EtapaType) => {
    try {
      setUpdatingId(agendamento.id)

      const response = await fetch(`http://localhost:8080/agendas/${agendamento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          etapa: novaEtapa,
        }),
      })

      if (response.ok) {
        toast.success(`Agendamento marcado como "${ETAPAS_CONFIG[novaEtapa].label}"!`)
        await fetchAgendamentos()
      } else {
        toast.error("Erro ao atualizar etapa")
      }
    } catch (error) {
      toast.error("Erro ao atualizar etapa")
      console.error("Erro ao atualizar etapa:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd/MM/yyyy", { locale: ptBR })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (etapa: string) => {
    const config = ETAPAS_CONFIG[etapa as EtapaType]
    if (!config) {
      return <Badge variant="secondary">{etapa}</Badge>
    }

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
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

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Agendamentos</h1>
            <p className="text-slate-300">Visualize e gerencie todos os agendamentos e suas etapas</p>
          </div>

          <Button onClick={fetchAgendamentos} variant="outline" className="border-slate-600 text-black">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>


        {/* Componente de filtros */}
        <FilterComponent
          entity="Agendamentos"
          fields={AGENDAMENTO_FILTER_FIELDS}
          onFilter={aplicarFiltros}
          onClear={limparFiltros}
          loading={filterLoading}
        />

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Lista de Agendamentos</CardTitle>
            <CardDescription className="text-slate-300">
              Todos os agendamentos realizados no sistema com controle de etapas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-slate-300">Carregando agendamentos...</p>
              </div>
            ) : agendamentos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">Cliente</TableHead>
                    <TableHead className="text-slate-300">Contato</TableHead>
                    <TableHead className="text-slate-300">Data</TableHead>
                    <TableHead className="text-slate-300">Barbeiro</TableHead>
                    <TableHead className="text-slate-300">Serviço</TableHead>
                    <TableHead className="text-slate-300">Horário</TableHead>
                    <TableHead className="text-slate-300">Valor</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agendamentos.map((agendamento) => (
                    <TableRow key={agendamento.id} className="border-slate-700">
                      <TableCell className="text-white">{agendamento.id}</TableCell>
                      <TableCell className="text-white font-medium">{agendamento.nome}</TableCell>
                      <TableCell className="text-white">{agendamento.contato}</TableCell>
                      <TableCell className="text-white">{formatDate(agendamento.dia)}</TableCell>
                      <TableCell className="text-white">{agendamento.registroBarbeiro.nome}</TableCell>
                      <TableCell className="text-white">
                        <div>
                          <div className="font-medium">{agendamento.registroServico.descricao}</div>
                          <div className="text-sm text-slate-400">
                            {formatarMoeda(agendamento.registroServico.valor)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="text-sm">
                          {agendamento.registroHorario.horarioInicio} - {agendamento.registroHorario.horarioFim}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="font-medium text-amber-400">{formatarMoeda(agendamento.valor)}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(agendamento.etapa)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {/* Botões de ação rápida */}
                          {agendamento.etapa === "PENDENTE" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => atualizacaoRapida(agendamento, "CONFIRMADO")}
                                disabled={updatingId === agendamento.id}
                                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white text-xs"
                                title="Confirmar agendamento"
                              >
                                Confirmar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => atualizacaoRapida(agendamento, "CANCELADO")}
                                disabled={updatingId === agendamento.id}
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-xs"
                                title="Cancelar agendamento"
                              >
                                Cancelar
                              </Button>
                            </>
                          )}

                          {agendamento.etapa === "CONFIRMADO" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => atualizacaoRapida(agendamento, "CONCLUIDO")}
                              disabled={updatingId === agendamento.id}
                              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white text-xs"
                              title="Marcar como concluído"
                            >
                              Concluir
                            </Button>
                          )}

                          {/* Botão para edição completa */}
                          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => abrirDialogAtualizacao(agendamento)}
                                className="border-slate-600 text-black hover:bg-slate-700"
                                title="Editar etapa"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-300">Nenhum agendamento encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para atualização de etapa */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Atualizar Etapa do Agendamento</DialogTitle>
              <DialogDescription className="text-slate-300">
                {selectedAgendamento && (
                  <>
                    Agendamento #{selectedAgendamento.id} - {selectedAgendamento.nome}
                    <br />
                    Etapa atual:{" "}
                    <span className="font-medium">{ETAPAS_CONFIG[selectedAgendamento.etapa as EtapaType]?.label}</span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            {selectedAgendamento && (
              <div className="space-y-4">
                {/* Informações do agendamento */}
                <div className="p-4 bg-slate-700 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Detalhes do Agendamento</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-300">Cliente:</div>
                    <div className="text-white">{selectedAgendamento.nome}</div>
                    <div className="text-slate-300">Barbeiro:</div>
                    <div className="text-white">{selectedAgendamento.registroBarbeiro.nome}</div>
                    <div className="text-slate-300">Serviço:</div>
                    <div className="text-white">{selectedAgendamento.registroServico.descricao}</div>
                    <div className="text-slate-300">Data:</div>
                    <div className="text-white">{formatDate(selectedAgendamento.dia)}</div>
                    <div className="text-slate-300">Horário:</div>
                    <div className="text-white">
                      {selectedAgendamento.registroHorario.horarioInicio} -{" "}
                      {selectedAgendamento.registroHorario.horarioFim}
                    </div>
                  </div>
                </div>

                {/* Seleção de nova etapa */}
                <div className="space-y-2">
                  <label className="text-white font-medium">Nova Etapa</label>
                  <Select value={novaEtapa} onValueChange={(value) => setNovaEtapa(value as EtapaType)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ETAPAS_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center space-x-2">
                            <span>{config.label}</span>
                            <span className="text-xs text-slate-400">- {config.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Botões de ação */}
                <div className="flex space-x-3">
                  <Button
                    onClick={atualizarEtapa}
                    disabled={updatingId === selectedAgendamento.id || novaEtapa === selectedAgendamento.etapa}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-black"
                  >
                    {updatingId === selectedAgendamento.id ? "Atualizando..." : "Atualizar Etapa"}
                  </Button>
                  <Button variant="outline" onClick={fecharDialog} className="border-slate-600 text-black">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
