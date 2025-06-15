"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Database, Clock, Scissors, Users, Calendar } from "lucide-react"
import { toast } from "sonner"
import { horarioService, servicoService, barbeiroService, agendamentoService } from "@/services/api"
import type { BarbeiroCreateRequest } from "@/types"

export default function SeederPage() {
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [loadingServicos, setLoadingServicos] = useState(false)
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(false)
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false)

  // Estados para a quantidade de itens a serem semeados
  const [numHorarios, setNumHorarios] = useState(5)
  const [numServicos, setNumServicos] = useState(5)
  const [numBarbeiros, setNumBarbeiros] = useState(3)
  const [numAgendamentos, setNumAgendamentos] = useState(5)

  // Função auxiliar para obter um subconjunto de IDs
  const getRandomSubsetIds = <T extends { id: number }>(items: T[], count: number): number[] => {
    const shuffled = [...items].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count).map((item) => item.id)
  }

  const baseHorarios = [
        { horaInicio: "08:00:00", horaFim: "09:00:00" },
        { horaInicio: "09:00:00", horaFim: "10:00:00" },
        { horaInicio: "10:00:00", horaFim: "11:00:00" },
        { horaInicio: "11:00:00", horaFim: "12:00:00" },
        { horaInicio: "13:00:00", horaFim: "14:00:00" },
        { horaInicio: "14:00:00", horaFim: "15:00:00" },
        { horaInicio: "15:00:00", horaFim: "16:00:00" },
        { horaInicio: "16:00:00", horaFim: "17:00:00" },
        { horaInicio: "17:00:00", horaFim: "18:00:00" },
        { horaInicio: "18:00:00", horaFim: "19:00:00" },
        { horaInicio: "19:00:00", horaFim: "20:00:00" },
      ]

  // Dados de exemplo para Horários
  const seedHorarios = async () => {
    setLoadingHorarios(true)
    try {
      
      for (let i = 0; i < numHorarios; i++) {
        const horario = baseHorarios[i % baseHorarios.length]
        await horarioService.criar(horario)
      }
      toast.success(`${numHorarios} Horário(s) semeado(s) com sucesso!`)
    } catch (error) {
      toast.error("Erro ao semear horários.")
      console.error("Erro ao semear horários:", error)
    } finally {
      setLoadingHorarios(false)
    }
  }

  const baseServicos = [
        { descricao: "Corte Cabelo", valor: 30.0 },
        { descricao: "Corte Barba", valor: 25.0 },
        { descricao: "Cabelo + Barba", valor: 50.0 },
        { descricao: "Pezinho", valor: 10.0 },
        { descricao: "Hidratação", valor: 20.0 },
        { descricao: "Coloração", valor: 120.0 },
        { descricao: "Relaxamento", valor: 70.0 },
        { descricao: "Sobrancelha", valor: 15.0 },
  ]

  // Dados de exemplo para Serviços
  const seedServicos = async () => {
    setLoadingServicos(true)
    try {
      
      for (let i = 0; i < numServicos; i++) {
        const servico = baseServicos[i % baseServicos.length]
        await servicoService.criar(servico)
      }
      toast.success(`${numServicos} Serviço(s) semeado(s) com sucesso!`)
    } catch (error) {
      toast.error("Erro ao semear serviços.")
      console.error("Erro ao semear serviços:", error)
    } finally {
      setLoadingServicos(false)
    }
  }

  // Dados de exemplo para Barbeiros (assumindo que serviços e horários já existem)
  const seedBarbeiros = async () => {
    setLoadingBarbeiros(true)
    try {
      const todosServicos = await servicoService.listar()
      const todosHorarios = await horarioService.listar()

      if (todosServicos.length === 0 || todosHorarios.length === 0) {
        toast.error("Por favor, semeeie os serviços e horários primeiro.")
        return
      }

      const baseNomes = ["João Silva", "Pedro Santos", "Carlos Lima", "Mariana Costa", "Fernando Souza", "Ana Paula"]
      const barbeirosToCreate: BarbeiroCreateRequest[] = []

      for (let i = 0; i < numBarbeiros; i++) {
        const nome = baseNomes[i % baseNomes.length] + ` ${i + 1}` // Adiciona um número para nomes únicos
        const servicosIds = getRandomSubsetIds(todosServicos, Math.min(3, todosServicos.length)) // Pega até 3 serviços aleatórios
        const horariosIds = getRandomSubsetIds(todosHorarios, Math.min(5, todosHorarios.length)) // Pega até 5 horários aleatórios

        barbeirosToCreate.push({
          nome,
          servicos: servicosIds,
          horarios: horariosIds,
        })
      }

      for (const b of barbeirosToCreate) {
        await barbeiroService.criar(b)
      }
      toast.success(`${numBarbeiros} Barbeiro(s) semeado(s) com sucesso!`)
    } catch (error) {
      toast.error("Erro ao semear barbeiros. Verifique se serviços e horários foram semeados.")
      console.error("Erro ao semear barbeiros:", error)
    } finally {
      setLoadingBarbeiros(false)
    }
  }

  // Dados de exemplo para Agendamentos (assumindo que barbeiros, serviços e horários já existem)
  const seedAgendamentos = async () => {
    setLoadingAgendamentos(true)
    try {
      const todosBarbeiros = await barbeiroService.listar()


      if (todosBarbeiros.length === 0) {
        toast.error("Por favor, semeeie barbeiros primeiro.")
        return
      }

      const baseNomesClientes = ["Cliente A", "Cliente B", "Cliente C", "Cliente D", "Cliente E"]
      const baseContatos = ["(11)98765-4321", "(11)98765-4322", "(11)98765-4323", "(11)98765-4324", "(11)98765-4325"]

      for (let i = 0; i < numAgendamentos; i++) {
        const barbeiroAleatorio = todosBarbeiros[Math.floor(Math.random() * todosBarbeiros.length)]

                // Verificar se o barbeiro tem serviços e horários associados
        if (barbeiroAleatorio.servicos.length === 0) {
          toast.error(`Barbeiro ${barbeiroAleatorio.nome} não possui serviços cadastrados. Pulando agendamento.`)
          continue
        }
        if (barbeiroAleatorio.horarios.length === 0) {
          toast.error(`Barbeiro ${barbeiroAleatorio.nome} não possui horários cadastrados. Pulando agendamento.`)
          continue
        }

        const servicoAleatorio =
          barbeiroAleatorio.servicos[Math.floor(Math.random() * barbeiroAleatorio.servicos.length)]
        const horarioAleatorio =
          barbeiroAleatorio.horarios[Math.floor(Math.random() * barbeiroAleatorio.horarios.length)]

        const dia = new Date()
        dia.setDate(dia.getDate() + (i % 3)) // Distribui agendamentos entre hoje, amanhã e depois de amanhã

        await agendamentoService.criar(
          {
            nome: baseNomesClientes[i % baseNomesClientes.length] + ` ${i + 1}`,
            contato: baseContatos[i % baseContatos.length],
            barbeiroId: barbeiroAleatorio.id,
            servicoId: servicoAleatorio.id,
            horarioId: horarioAleatorio.id,
            dia: dia.toISOString(),
          },
          dia,
        )
      }
      toast.success(`${numAgendamentos} Agendamento(s) semeado(s) com sucesso!`)
    } catch (error) {
      toast.error("Erro ao semear agendamentos. Verifique se barbeiros, serviços e horários foram semeados.")
      console.error("Erro ao semear agendamentos:", error)
    } finally {
      setLoadingAgendamentos(false)
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

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Seeder de Dados</h1>
            <p className="text-slate-300">Popule o banco de dados com dados de exemplo para testes</p>
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Semear Entidades
            </CardTitle>
            <CardDescription className="text-slate-300">
              Defina a quantidade e clique nos botões para adicionar dados de exemplo ao seu backend. Recomenda-se
              seguir a ordem: Horários &gt; Serviços &gt; Barbeiros &gt; Agendamentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Horários */}
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="numHorarios" className="text-white">
                  Quantidade de Horários
                </Label>
                <Input
                  id="numHorarios"
                  type="number"
                  min="1"
                  max={baseHorarios.length}
                  value={numHorarios}
                  onChange={(e) => setNumHorarios(Number(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={seedHorarios}
                disabled={loadingHorarios || numHorarios <= 0}
                className="bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center"
              >
                {loadingHorarios ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></span>
                    Semeando...
                  </span>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Semear Horários
                  </>
                )}
              </Button>
            </div>

            {/* Serviços */}
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="numServicos" className="text-white">
                  Quantidade de Serviços
                </Label>
                <Input
                  id="numServicos"
                  type="number"
                  min="1"      
                  max={baseServicos.length}      
                  value={numServicos}
                  onChange={(e) => setNumServicos(Number(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={seedServicos}
                disabled={loadingServicos || numServicos <= 0}
                className="bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center"
              >
                {loadingServicos ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></span>
                    Semeando...
                  </span>
                ) : (
                  <>
                    <Scissors className="mr-2 h-4 w-4" />
                    Semear Serviços
                  </>
                )}
              </Button>
            </div>

            {/* Barbeiros */}
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="numBarbeiros" className="text-white">
                  Quantidade de Barbeiros
                </Label>
                <Input
                  id="numBarbeiros"
                  type="number"
                  min="1"
                  value={numBarbeiros}
                  onChange={(e) => setNumBarbeiros(Number(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={seedBarbeiros}
                disabled={loadingBarbeiros || numBarbeiros <= 0}
                className="bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center"
              >
                {loadingBarbeiros ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></span>
                    Semeando...
                  </span>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Semear Barbeiros
                  </>
                )}
              </Button>
            </div>

            {/* Agendamentos */}
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="numAgendamentos" className="text-white">
                  Quantidade de Agendamentos
                </Label>
                <Input
                  id="numAgendamentos"
                  type="number"
                  min="1"
                  value={numAgendamentos}
                  onChange={(e) => setNumAgendamentos(Number(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={seedAgendamentos}
                disabled={loadingAgendamentos || numAgendamentos <= 0}
                className="bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center"
              >
                {loadingAgendamentos ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></span>
                    Semeando...
                  </span>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Semear Agendamentos
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
