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
import { servicoService } from "@/services/api"
import { filterService } from "@/services/filterService"
import { FilterComponent } from "@/components/filters/FilterComponent"
import type { Servico } from "@/types"

// Configuração dos campos de filtro para serviços
const SERVICO_FILTER_FIELDS = [
  { key: "id", label: "ID", type: "number" as const, placeholder: "Ex: 1" },
  { key: "descricao", label: "Descrição", type: "text" as const, placeholder: "Ex: Corte de cabelo" },
  { key: "valor", label: "Valor", type: "number" as const, placeholder: "Ex: 25.00" },
  { key: "createdAt", label: "Data de Criação", type: "date" as const },
]

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [servicosOriginais, setServicosOriginais] = useState<Servico[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingServico, setEditingServico] = useState<Servico | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
  })

  useEffect(() => {
    fetchServicos()
  }, [])

  const fetchServicos = async () => {
    try {
      setLoading(true)
      const data = await servicoService.listar()
      setServicos(data)
      setServicosOriginais(data)
    } catch (error) {
      toast.error("Erro ao carregar serviços")
    } finally {
      setLoading(false)
    }
  }

  // Aplicar filtros
  const aplicarFiltros = async (filters: Record<string, any>) => {
    setFilterLoading(true)
    try {
      const servicosFilterados = await filterService.filtrar<Servico>("servicos", filters)
      setServicos(servicosFilterados)
      toast.success(`${servicosFilterados.length} serviço(s) encontrado(s)`)
    } catch (error) {
      toast.error("Erro ao aplicar filtros")
      console.error("Erro ao filtrar serviços:", error)
    } finally {
      setFilterLoading(false)
    }
  }

  // Limpar filtros
  const limparFiltros = () => {
    setServicos(servicosOriginais)
    toast.success("Filtros removidos")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const url = "http://localhost:8080/servicos"
      const method = editingServico ? "PUT" : "POST"
      const body = editingServico
        ? { ...formData, id: editingServico.id, valor: Number.parseFloat(formData.valor) }
        : { ...formData, valor: Number.parseFloat(formData.valor) }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(`Serviço ${editingServico ? "atualizado" : "cadastrado"} com sucesso!`)
        setIsDialogOpen(false)
        setEditingServico(null)
        setFormData({ descricao: "", valor: "" })
        fetchServicos()
      }
    } catch (error) {
      toast.error("Erro ao salvar serviço")
    } finally {
      setLoading(false)
    }
  }

  const toggleServicoStatus = async (id: number, ativo: string) => {
    try {
      const action = ativo ? "ativar" : "desativar"
      const response = await fetch(`http://localhost:8080/servicos/${id}/${action}`, {
        method: "PUT",
      })

      if (response.ok) {
        toast.success(`Serviço ${ativo ? "ativado" : "desativado"} com sucesso!`)
        fetchServicos()
      }
    } catch (error) {
      toast.error("Erro ao alterar status do serviço")
    }
  }

  const openEditDialog = (servico: Servico) => {
    setEditingServico(servico)
    setFormData({
      descricao: servico.descricao,
      valor: servico.valor.toString(),
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
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Serviços</h1>
            <p className="text-slate-300">Cadastre e gerencie os serviços oferecidos</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                <Plus className="mr-2 h-4 w-4" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingServico ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
                <DialogDescription className="text-slate-300">
                  {editingServico ? "Edite as informações do serviço" : "Cadastre um novo serviço"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-white">
                    Descrição
                  </Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-white">
                    Valor (R$)
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black" disabled={loading}>
                {loading ? "Salvando..." : editingServico ? "Atualizar" : "Cadastrar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        
        {/* Componente de filtros */}
        <FilterComponent
          entity="Serviços"
          fields={SERVICO_FILTER_FIELDS}
          onFilter={aplicarFiltros}
          onClear={limparFiltros}
          loading={filterLoading}
        />

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Lista de Serviços</CardTitle>
            <CardDescription className="text-slate-300">Todos os serviços cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && servicos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-300">Carregando serviços...</p>
              </div>
            ) : servicos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">ID</TableHead>
                  <TableHead className="text-slate-300">Descrição</TableHead>
                  <TableHead className="text-slate-300">Valor</TableHead>
                  <TableHead className="text-slate-300">Atualizado</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicos.map((servico) => (
                  <TableRow key={servico.id} className="border-slate-700">
                    <TableCell className="text-white">{servico.id}</TableCell>
                    <TableCell className="text-white">{servico.descricao}</TableCell>
                    <TableCell className="text-white">R$ {servico.valor.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-white">{servico.updatedAt?formatarDataCompleta(servico.updatedAt):""}</TableCell>
                    <TableCell>
                      <Badge variant={servico.deletedAt ? "secondary" : "default"}>
                        {servico.deletedAt ? "Inativo" : "Ativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(servico)}
                          className="border-slate-600 text-black hover:bg-slate-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleServicoStatus(servico.id, servico.deletedAt)}
                          className="border-slate-600 text-black hover:bg-slate-700"
                        >
                          {servico.deletedAt ? <PowerOff className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-300">Nenhum serviço encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
