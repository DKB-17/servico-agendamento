import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Scissors, Users, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">BarberShop Pro</h1>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black">
                Área Administrativa
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Agende seu corte com os melhores profissionais</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Sistema moderno de agendamento para barbearias. Escolha seu barbeiro, serviço e horário de forma rápida e
            fácil.
          </p>
          <Link href="/agendamento">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 text-lg">
              Agendar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Calendar className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle className="text-white">Agendamento Fácil</CardTitle>
                <CardDescription className="text-slate-300">
                  Agende seus serviços de forma rápida e intuitiva
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Users className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle className="text-white">Profissionais Qualificados</CardTitle>
                <CardDescription className="text-slate-300">
                  Escolha entre nossos barbeiros especializados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Clock className="h-12 w-12 text-amber-500 mb-4" />
                <CardTitle className="text-white">Horários Flexíveis</CardTitle>
                <CardDescription className="text-slate-300">
                  Diversos horários disponíveis para sua conveniência
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
