"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, PowerOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { formatarDataCompleta, formatarMoeda } from "@/utils/formatters"
import { barbeiroService, servicoService, horarioService } from "@/services/api"
import { filterService } from "@/services/filterService"
import { FilterComponent } from "@/components/filters/FilterComponent"
import type { Barbeiro, Servico, Horario } from "@/types"

// Configuração dos campos de filtro para barbeiros
const BARBEIRO_FILTER_FIELDS = [
  { key: "id", label: "ID", type: "number" as const, placeholder: "Ex: 1" },
  { key: "nome", label: "Nome", type: "text" as const, placeholder: "Ex: João Silva" },
  { key: "caminhoImagem", label: "Tem Imagem", type: "boolean" as const },
  { key: "createdAt", label: "Data de Criação", type: "date" as const },
]

// Página de gerenciamento de barbeiros
export default function BarbeirosPage() {
  // Estados para dados
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [barbeirosOriginais, setBarbeirosOriginais] = useState<Barbeiro[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [horarios, setHorarios] = useState<Horario[]>([])

  // Estados para UI
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBarbeiro, setEditingBarbeiro] = useState<Barbeiro | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)
  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    servicosIds: [] as number[],
    horariosIds: [] as number[],
  })

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados()
  }, [])

  // Função para carregar todos os dados necessários
  const carregarDados = async () => {
    setLoading(true)
    try {
      // Carregar dados em paralelo
      const [barbeirosData, servicosData, horariosData] = await Promise.all([
        barbeiroService.listar(),
        servicoService.listar(),
        horarioService.listar(),
      ])

      setBarbeiros(barbeirosData)
      setBarbeirosOriginais(barbeirosData)
      setServicos(servicosData)
      setHorarios(horariosData)
    } catch (error) {
      toast.error("Erro ao carregar dados")
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

    // Aplicar filtros
  const aplicarFiltros = async (filters: Record<string, any>) => {
    setFilterLoading(true)
    try {
      const barbeirosFilterados = await filterService.filtrar<Barbeiro>("barbeiros", filters)
      setBarbeiros(barbeirosFilterados)
      toast.success(`${barbeirosFilterados.length} barbeiro(s) encontrado(s)`)
    } catch (error) {
      toast.error("Erro ao aplicar filtros")
      console.error("Erro ao filtrar barbeiros:", error)
    } finally {
      setFilterLoading(false)
    }
  }

  // Limpar filtros
  const limparFiltros = () => {
    setBarbeiros(barbeirosOriginais)
    toast.success("Filtros removidos")
  }

  // Abrir formulário para edição
  const abrirEdicao = (barbeiro: Barbeiro) => {
    setEditingBarbeiro(barbeiro)
    setFormData({
      nome: barbeiro.nome,
      servicosIds: barbeiro.servicos.map((s) => s.id),
      horariosIds: barbeiro.horarios.map((h) => h.id),
    })
    setIsDialogOpen(true)
  }

  // Abrir formulário para novo barbeiro
  const abrirNovo = () => {
    setEditingBarbeiro(null)
    setFormData({
      nome: "",
      servicosIds: [],
      horariosIds: [],
    })
    setIsDialogOpen(true)
  }

  // Fechar formulário
  const fecharFormulario = () => {
    setIsDialogOpen(false)
    setEditingBarbeiro(null)
  }

  // Atualizar campo do formulário
  const atualizarNome = (nome: string) => {
    setFormData((prev) => ({ ...prev, nome }))
  }

  // Alternar seleção de serviço
  const alternarServico = (servicoId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      servicosIds: checked ? [...prev.servicosIds, servicoId] : prev.servicosIds.filter((id) => id !== servicoId),
    }))
  }

  // Alternar seleção de horário
  const alternarHorario = (horarioId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      horariosIds: checked ? [...prev.horariosIds, horarioId] : prev.horariosIds.filter((id) => id !== horarioId),
    }))
  }

  // Salvar barbeiro (criar ou atualizar)
  const salvarBarbeiro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingBarbeiro) {
        // Atualizar barbeiro existente
        await barbeiroService.atualizar({
          id: editingBarbeiro.id,
          nome: formData.nome,
          caminhoImagem: editingBarbeiro.caminhoImagem,
          servicos: formData.servicosIds,
          horarios: formData.horariosIds,
        })
        toast.success("Barbeiro atualizado com sucesso!")
      } else {
        // Criar novo barbeiro
        await barbeiroService.criar({
          nome: formData.nome,
          servicos: formData.servicosIds,
          horarios: formData.horariosIds,
        })
        toast.success("Barbeiro cadastrado com sucesso!")
      }

      // Recarregar dados e fechar formulário
      await carregarDados()
      fecharFormulario()
    } catch (error) {
      toast.error(editingBarbeiro ? "Erro ao atualizar barbeiro" : "Erro ao cadastrar barbeiro")
      console.error("Erro ao salvar barbeiro:", error)
    } finally {
      setLoading(false)
    }
  }

  // Alternar status do barbeiro (ativar/desativar)
  const alternarStatus = async (id: number, ativo: boolean) => {
    setLoading(true)
    try {
      if (ativo) {
        await barbeiroService.desativar(id)
        toast.success("Barbeiro desativado com sucesso!")
      } else {
        await barbeiroService.ativar(id)
        toast.success("Barbeiro ativado com sucesso!")
      }
      await carregarDados()
    } catch (error) {
      toast.error("Erro ao alterar status do barbeiro")
      console.error("Erro ao alterar status:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho da página */}
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
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Barbeiros</h1>
            <p className="text-slate-300">Cadastre e gerencie os barbeiros da barbearia</p>
          </div>

          {/* Botão para abrir formulário de novo barbeiro */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={abrirNovo} className="bg-amber-500 hover:bg-amber-600 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Novo Barbeiro
              </Button>
            </DialogTrigger>

            {/* Formulário de barbeiro (dialog) */}
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingBarbeiro ? "Editar Barbeiro" : "Novo Barbeiro"}
                </DialogTitle>
                <DialogDescription className="text-slate-300">
                  {editingBarbeiro
                    ? "Edite as informações do barbeiro e seus serviços/horários"
                    : "Cadastre um novo barbeiro e defina seus serviços e horários"}
                </DialogDescription>
              </DialogHeader>

              {/* Formulário */}
              <form onSubmit={salvarBarbeiro} className="space-y-6">
                {/* Nome do barbeiro */}
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-white">
                    Nome do Barbeiro
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => atualizarNome(e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Digite o nome do barbeiro"
                  />
                </div>

                {/* Seleção de serviços */}
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Serviços</CardTitle>
                    <CardDescription className="text-slate-300">
                      Selecione os serviços que este barbeiro pode realizar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {servicos.length > 0 ? (
                      servicos.map((servico) => (
                        <div key={servico.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={`servico-${servico.id}`}
                            checked={formData.servicosIds.includes(servico.id)}
                            onCheckedChange={(checked) => alternarServico(servico.id, checked as boolean)}
                          />
                          <Label htmlFor={`servico-${servico.id}`} className="text-white flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <span>{servico.descricao}</span>
                              <span className="text-amber-400 font-medium">{formatarMoeda(servico.valor)}</span>
                            </div>
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">Nenhum serviço cadastrado</p>
                    )}
                  </CardContent>
                </Card>

                {/* Seleção de horários */}
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Horários</CardTitle>
                    <CardDescription className="text-slate-300">
                      Selecione os horários em que este barbeiro trabalha
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {horarios.length > 0 ? (
                      horarios.map((horario) => (
                        <div key={horario.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={`horario-${horario.id}`}
                            checked={formData.horariosIds.includes(horario.id)}
                            onCheckedChange={(checked) => alternarHorario(horario.id, checked as boolean)}
                          />
                          <Label htmlFor={`horario-${horario.id}`} className="text-white cursor-pointer">
                            {horario.horarioInicio} - {horario.horarioFim}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">Nenhum horário cadastrado</p>
                    )}
                  </CardContent>
                </Card>

                {/* Botões de ação */}
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Salvando..." : editingBarbeiro ? "Atualizar Barbeiro" : "Cadastrar Barbeiro"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fecharFormulario}
                    className="border-slate-600 text-black"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Componente de filtros */}
        <FilterComponent
          entity="Barbeiros"
          fields={BARBEIRO_FILTER_FIELDS}
          onFilter={aplicarFiltros}
          onClear={limparFiltros}
          loading={filterLoading}
        />

        {/* Tabela de barbeiros */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Lista de Barbeiros</CardTitle>
            <CardDescription className="text-slate-300">
              Todos os barbeiros cadastrados no sistema com seus serviços e horários
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && barbeiros.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-300">Carregando barbeiros...</p>
              </div>
            ) : barbeiros.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">Nome</TableHead>
                    <TableHead className="text-slate-300">Serviços</TableHead>
                    <TableHead className="text-slate-300">Horários</TableHead>
                    <TableHead className="text-slate-300">Atualizado</TableHead>
                    <TableHead className="text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barbeiros.map((barbeiro) => (
                    <TableRow key={barbeiro.id} className="border-slate-700">
                      <TableCell className="text-white">{barbeiro.id}</TableCell>
                      <TableCell className="text-white font-medium">{barbeiro.nome}</TableCell>
                      <TableCell className="text-white">
                        {barbeiro.servicos.length > 0 ? (
                          <div className="space-y-1">
                            {barbeiro.servicos.map((servico) => (
                              <div key={servico.id} className="text-sm">
                                <span className="text-slate-300">{servico.descricao}</span>
                                <span className="text-amber-400 ml-2">{formatarMoeda(servico.valor)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm">Nenhum serviço</span>
                        )}
                      </TableCell>
                      <TableCell className="text-white">
                        {barbeiro.horarios.length > 0 ? (
                          <div className="space-y-1">
                            {barbeiro.horarios.map((horario) => (
                              <div key={horario.id} className="text-sm text-slate-300">
                                {horario.horarioInicio} - {horario.horarioFim}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm">Nenhum horário</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm">{formatarDataCompleta(barbeiro.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => abrirEdicao(barbeiro)}
                            className="border-slate-600 text-black hover:bg-slate-700"
                            title="Editar barbeiro"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alternarStatus(barbeiro.id, true)} // Assumindo ativo por padrão
                            className="border-slate-600 text-black hover:bg-slate-700"
                            title="Desativar barbeiro"
                          >
                            <PowerOff className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-300">Nenhum barbeiro encontrado</p>
                <Button onClick={abrirNovo} className="mt-4 bg-amber-500 hover:bg-amber-600 text-black">
                  Cadastrar Primeiro Barbeiro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
