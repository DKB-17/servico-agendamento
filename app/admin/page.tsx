import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Clock, Scissors, Calendar, DollarSign, ArrowLeft, Database } from "lucide-react"
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-amber-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Site
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-slate-300">Gerencie barbeiros, serviços, horários e agendamentos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/barbeiros">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
              <CardHeader>
                <Users className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle className="text-white">Barbeiros</CardTitle>
                <CardDescription className="text-slate-300">Gerenciar barbeiros e seus serviços</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/servicos">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
              <CardHeader>
                <Scissors className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle className="text-white">Serviços</CardTitle>
                <CardDescription className="text-slate-300">Cadastrar e editar serviços oferecidos</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/horarios">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
              <CardHeader>
                <Clock className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle className="text-white">Horários</CardTitle>
                <CardDescription className="text-slate-300">Configurar horários de funcionamento</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/agendamentos">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
              <CardHeader>
                <Calendar className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle className="text-white">Agendamentos</CardTitle>
                <CardDescription className="text-slate-300">Visualizar e gerenciar agendamentos</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/caixa">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle className="text-white">Caixa</CardTitle>
                <CardDescription className="text-slate-300">Relatórios financeiros e faturamento</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/seeder">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
              <CardHeader>
                <Database className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle className="text-white">Seeder de Dados</CardTitle>
                <CardDescription className="text-slate-300">
                  Popule o banco de dados com dados de exemplo
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

        </div>
      </div>
    </div>
  )
}
