"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Lock, User, Phone, Chrome, EyeOff, Eye } from "lucide-react"
import { api } from "@/lib/api"
import type { ClienteResponse } from "@/types"
import { toast } from "sonner"

export default function ClienteAuthPage() {
  const [isLogin, setIsLogin] = useState(true) // true for login, false for register
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [cpf, setCpf] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // Novo estado para visibilidade da senha
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response: ClienteResponse = await api.cliente.login(email, password)
      console.log(response)
      if (response && response.usuario && response.usuario.id) {
        localStorage.setItem("clientData", JSON.stringify(response))
        toast.success("Login realizado com sucesso!")
        router.push("/") // Redireciona para a página inicial ou dashboard do cliente
      } else {
        toast.error("Credenciais inválidas. Verifique seu e-mail e senha.")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast.error("Erro ao fazer login. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.cliente.create({ nome: name, contato: contact, cpf:cpf, email, senha: password })
      if (response && response.usuario && response.usuario.id) {
        toast.success("Conta criada com sucesso! Faça login para continuar.")
        setIsLogin(true) // Volta para a tela de login após o registro
        setEmail("")
        setPassword("")
        setName("")
        setContact("")
        setCpf("")
        localStorage.setItem("clientData", JSON.stringify(response))
        toast.success("Login realizado com sucesso!")
        router.push("/") // Redireciona para a página inicial ou dashboard do cliente
      } else {
        const errorData = await response
        toast.error(`Erro ao criar conta: ${errorData || "Verifique os dados e tente novamente."}`)
      }
    } catch (error) {
      console.error("Erro ao registrar:", error)
      toast.error("Erro ao criar conta. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/fundo_login.jpg?height=1080&width=1920')" }}
    >
      <div className="absolute inset-0 bg-black/70 "></div>
      <Card className="relative z-10 w-full max-w-md bg-barbershop-800 border-barbershop-700 text-primary shadow-lg">
        <CardContent className="p-8 backdrop-blur-lg bg-black/30">
          <div className="text-center mb-8">
            <Link href="/" className="text-5xl font-extrabold text-barbershop-primary">
              Costa
            </Link>
          </div>

          <div className="flex justify-center mb-6">
            <Button
              variant="ghost"
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 text-lg font-semibold ${
                isLogin ? "text-barbershop-gold border-b-2 border-barbershop-gold" : "text-primary-400"
              }`}
            >
              Já tenho conta
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 text-lg font-semibold ${
                !isLogin ? "text-barbershop-gold border-b-2 border-barbershop-gold" : "text-slate-400"
              }`}
            >
              Criar conta
            </Button>
          </div>

          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-login" className="text-primary-300">
                  Email:
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    className="pl-10 bg-barbershop-700 border-barbershop-600 text-black focus:border-barbershop-gold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login" className="text-slate-300">
                  Senha:
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password-login"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="pl-10 pr-10 bg-barbershop-700 border-barbershop-600 text-black focus:border-barbershop-gold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-slate-400 hover:text-barbershop-gold"
                    onClick={() => setShowPassword((prev) => !prev)} // Alterna a visibilidade
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              <Link href="#" className="text-sm text-barbershop-gold hover:underline block text-right">
                Esqueci minha senha
              </Link>
              <Button
                type="submit"
                className="w-full bg-barbershop-secondary hover:border-secondary-700 text-secondary font-semibold py-3 text-lg " 
                disabled={loading}
              >
                {loading ? "ENTRANDO..." : "ENTRAR"}
              </Button>
              <div className="relative flex items-center justify-center text-xs text-slate-400 uppercase">
                <span className="bg-barbershop-800 px-2 z-10">OU</span>
                <div className="absolute w-full border-t border-slate-600"></div>
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-barbershop-700 border-barbershop-600 text-white hover:bg-barbershop-600 hover:text-barbershop-gold"
                disabled={loading}
              >
                <Chrome className="h-5 w-5" />
                Fazer login com Google
              </Button>
            </form>
          ) : (
            // Register Form
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name-register" className="text-slate-300">
                  Nome:
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="name-register"
                    type="text"
                    placeholder="Seu nome completo"
                    className="pl-10 bg-barbershop-700 border-barbershop-600 text-black focus:border-barbershop-gold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-register" className="text-slate-300">
                  Contato:
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="contact-register"
                    type="tel"
                    placeholder="(XX)XXXXX-XXXX"
                    className="pl-10 bg-barbershop-700 border-barbershop-600 text-black focus:border-barbershop-gold"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>
              </div><div className="space-y-2">
                <Label htmlFor="cpf-register" className="text-slate-300">
                  CPF:
                </Label>
                <div className="relative">
                  <Input
                    id="cpf-register"
                    placeholder="XXX.XXX.XXX-XX"
                    className="pl-10 bg-barbershop-700 border-barbershop-600 text-black focus:border-barbershop-gold"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register" className="text-slate-300">
                  Email:
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    className="pl-10 bg-barbershop-700 border-barbershop-600 text-black focus:border-barbershop-gold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register" className="text-slate-300">
                  Senha:
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password-register"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="pl-10 pr-10 bg-barbershop-700 border-barbershop-600 text-black focus:border-barbershop-gold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-slate-400 hover:text-barbershop-gold"
                    onClick={() => setShowPassword((prev) => !prev)} // Alterna a visibilidade
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-barbershop-secondary hover:border-secondary-700 text-secondary font-semibold py-3 text-lg "
                disabled={loading}
              >
                {loading ? "PROSSEGUINDO..." : "PROSSEGUIR"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
