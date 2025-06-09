"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Edit, PowerOff } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { formatarDataCompleta } from "@/utils/formatters"
import { horarioService } from "@/services/api"
import { filterService } from "@/services/filterService"
import { FilterComponent } from "@/components/filters/FilterComponent"
import type { Horario } from "@/types"

// Configuração dos campos de filtro para horários
const HORARIO_FILTER_FIELDS = [
  { key: "id", label: "ID", type: "number" as const, placeholder: "Ex: 1" },
  { key: "horarioInicio", label: "Horário Início", type: "text" as const, placeholder: "Ex: 08:00:00" },
  { key: "horarioFim", label: "Horário Fim", type: "text" as const, placeholder: "Ex: 18:00:00" },
  { key: "createdAt", label: "Data de Criação", type: "date" as const },
]


export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [horariosOriginais, setHorariosOriginais] = useState<Horario[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHorario, setEditingHorario] = useState<Horario | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)
  const [formData, setFormData] = useState({
    horaInicio: "",
    horaFim: "",
  })

  useEffect(() => {
    fetchHorarios()
  }, [])

  const fetchHorarios = async () => {
    try {
      setLoading(true)
      const data = await horarioService.listar()
      setHorarios(data)
      setHorariosOriginais(data)
    } catch (error) {
      toast.error("Erro ao carregar horários")
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros
  const aplicarFiltros = async (filters: Record<string, any>) => {
    setFilterLoading(true)
    try {
      const horariosFilterados = await filterService.filtrar<Horario>("horarios", filters)
      setHorarios(horariosFilterados)
      toast.success(`${horariosFilterados.length} horário(s) encontrado(s)`)
    } catch (error) {
      toast.error("Erro ao aplicar filtros")
      console.error("Erro ao filtrar horários:", error)
    } finally {
      setFilterLoading(false)
    }
  }

  // Limpar filtros
  const limparFiltros = () => {
    setHorarios(horariosOriginais)
    toast.success("Filtros removidos")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const url = "http://localhost:8080/horarios"
      const method = editingHorario ? "PUT" : "POST"
      const body = editingHorario
        ? {
            id: editingHorario.id,
            horarioInicio: formData.horaInicio + ":00",
            horarioFim: formData.horaFim + ":00",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : {
            horaInicio: formData.horaInicio + ":00",
            horaFim: formData.horaFim + ":00",
          }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(`Horário ${editingHorario ? "atualizado" : "cadastrado"} com sucesso!`)
        setIsDialogOpen(false)
        setEditingHorario(null)
        setFormData({ horaInicio: "", horaFim: "" })
        fetchHorarios()
      }
    } catch (error) {
      toast.error("Erro ao salvar horário")
    } finally {
      setLoading(false)
    }
  }



  const toggleHorarioStatus = async (id: number, ativo: string) => {
    try {
      const action = ativo ? "ativar" : "desativar"
      const response = await fetch(`http://localhost:8080/horarios/${id}/${action}`, {
        method: "PUT",
      })

      if (response.ok) {
        toast.success(`Horário ${ativo ? "ativado" : "desativado"} com sucesso!`)
        fetchHorarios()
      }
    } catch (error) {
      toast.error("Erro ao alterar status do horário")
    }
  }

  const openEditDialog = (horario: Horario) => {
    setEditingHorario(horario)
    setFormData({
      horaInicio: horario.horarioInicio.substring(0, 5),
      horaFim: horario.horarioFim.substring(0, 5),
    })
    setIsDialogOpen(true)
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
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Horários</h1>
            <p className="text-slate-300">Configure os horários de funcionamento</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Novo Horário
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingHorario ? "Editar Horário" : "Novo Horário"}</DialogTitle>
                <DialogDescription className="text-slate-300">
                  {editingHorario ? "Edite o horário de funcionamento" : "Cadastre um novo horário"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="horaInicio" className="text-white">
                    Hora Início
                  </Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaFim" className="text-white">
                    Hora Fim
                  </Label>
                  <Input
                    id="horaFim"
                    type="time"
                    value={formData.horaFim}
                    onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black" disabled={loading}>
                {loading ? "Salvando..." : editingHorario ? "Atualizar" : "Cadastrar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Componente de filtros */}
        <FilterComponent
          entity="Horários"
          fields={HORARIO_FILTER_FIELDS}
          onFilter={aplicarFiltros}
          onClear={limparFiltros}
          loading={filterLoading}
        />

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Lista de Horários</CardTitle>
            <CardDescription className="text-slate-300">Todos os horários cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && horarios.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-300">Carregando horários...</p>
              </div>
            ) : horarios.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">ID</TableHead>
                  <TableHead className="text-slate-300">Hora Início</TableHead>
                  <TableHead className="text-slate-300">Hora Fim</TableHead>
                  <TableHead className="text-slate-300">Atualizado</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {horarios.map((horario) => (
                  <TableRow key={horario.id} className="border-slate-700">
                    <TableCell className="text-white">{horario.id}</TableCell>
                    <TableCell className="text-white">{horario.horarioInicio}</TableCell>
                    <TableCell className="text-white">{horario.horarioFim}</TableCell>
                    <TableCell className="text-white">{horario.updatedAt?formatarDataCompleta(horario.updatedAt):""}</TableCell>
                    <TableCell>
                      <Badge variant={horario.deletedAt ? "secondary" : "default"}>
                        {horario.deletedAt ? "Inativo" : "Ativo"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(horario)}
                          className="border-slate-600 text-black hover:bg-slate-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleHorarioStatus(horario.id, horario.deletedAt?horario.deletedAt:"")}
                          className="border-slate-600 text-black hover:bg-slate-700"
                        >
                          {horario.deletedAt ? <PowerOff className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-300">Nenhum horário encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
