"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MapPin, Clock } from "lucide-react"
import { formatarMoeda } from "@/utils/formatters"
import { Servico } from "@/types"
import { useEffect, useState } from "react"
import { servicoService } from "@/services/api"
import { toast } from "sonner"

export default function HomePage() {


  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchServicos()
  }, [])

  const fetchServicos = async () => {
    try {
      setLoading(true)
      const data = await servicoService.listar()
      setServicos(data)
    } catch (error) {
      toast.error("Erro ao carregar serviços")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-barbershop-950 via-barbershop-900 to-barbershop-950 text-white">
      {/* Header */}
      <header className= "border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-3xl font-bold text-amber-500">
              Costa
            </Link>
            <nav className="hidden md:flex space-x-6 text-lg">
              <Link href="#about" className="hover:text-amber-500 transition-colors">
                SOBRE
              </Link>
              <Link href="#services" className="hover:text-amber-500 transition-colors">
                SERVIÇOS
              </Link>
              <Link href="/agendamento" className="hover:text-amber-500 transition-colors">
                AGENDAR
              </Link>
              <Link href="/avaliacoes" className="hover:text-amber-500 transition-colors">
                AVALIAÇÕES
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center text-slate-300">
              <Phone className="h-4 w-4 mr-2 text-amber-500" />
              <span>(18) 99803-4635</span>
            </div>
              <Link href="/cliente">
              <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black">
                Minha Conta
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black">
                Área Administrativa
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[70vh]  flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images.jpeg?height=800&width=1600')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="z-10 p-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg">
            CRIE SEU ESTILO CONOSCO
          </h1>
          <Link href="/agendamento">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-10 py-6 text-xl rounded-full shadow-lg"
            >
              AGENDAR
            </Button>
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24 bg-slate-900">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-amber-500 mb-6">Sobre nós</h2>
            <p className="text-lg text-slate-300 mb-8">Qualidade a Cada Detalhe</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <Clock className="h-8 w-8 text-amber-500 mb-2" />
                  <CardTitle className="text-white text-xl">Horário de Funcionamento</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p>SEGUNDA A SEXTA: 09H - 20H</p>
                  <p>SÁBADO: 08H - 18H</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <MapPin className="h-8 w-8 text-amber-500 mb-2" />
                  <CardTitle className="text-white text-xl">Localização</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p>Av. Mário de Vito, Jardim Nossa Senhora de Fátima</p>
                  <p>RES. DANUSA, VILA MARIA IZABEL, VILA OPERARIA</p>
                  <p>R. Santo Antônio, Parque Bura, VILA CARVALHO, VILA CAMBUI</p>
                  <p>R. da Matriz, R. Portugal, R. Angelo Gava</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white">VISÃO</h3>
              <p className="text-slate-300">
                Ser reconhecidos como a barbearia de referência em nossa região, sinônimo de modernidade, qualidade e
                excelência no atendimento.
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img
              src="/placeholder.svg?height=500&width=500"
              alt="Carlos Costa"
              className="rounded-lg shadow-xl object-cover w-full h-auto max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-amber-500 mb-12">Serviços</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {servicos.map((service, index) => (
              <Card key={index} className="bg-slate-700 border-slate-600 flex flex-col items-center p-4">
                <img
                  src="/bigodinho_chave.svg"
                  alt={service.descricao}
                  className="w-24 h-24 mb-4"
                />
                <CardTitle className="text-white text-lg mb-2">{service.descricao}</CardTitle>
                <CardDescription className="text-amber-400 font-bold text-xl">
                  {formatarMoeda(service.valor)}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-900 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-8">NÃO PERCA TEMPO, AGENDE O SEU HORÁRIO.</h2>
          <Link href="/agendamento">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-10 py-6 text-xl rounded-full shadow-lg"
            >
              AGENDAR
            </Button>
          </Link>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <nav className="flex flex-wrap justify-center space-x-6 mb-4 text-lg">
            <Link href="#about" className="hover:text-amber-500 transition-colors">
              SOBRE
            </Link>
            <Link href="#services" className="hover:text-amber-500 transition-colors">
              SERVIÇOS
            </Link>
            <Link href="#contact" className="hover:text-amber-500 transition-colors">
              FALE CONOSCO
            </Link>
            <Link href="#" className="hover:text-amber-500 transition-colors">
              TRABALHE CONOSCO
            </Link>
          </nav>
          <p className="text-slate-400 text-sm">
            Copyright © linkedin.com/in/diegobritosilva. Todos os Direitos Reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
