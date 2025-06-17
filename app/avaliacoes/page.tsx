"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import type { RegistroPost, ClienteResponse, CadastroPost } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { StarRating } from "@/components/StarRating"
import { ThumbsUp } from "lucide-react"
import { Comentarios } from "./Comentarios/Comentarios"

export default function AvaliacoesPage() {
  const [posts, setPosts] = useState<RegistroPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [clienteData, setClienteData] = useState<ClienteResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPostLegenda, setNewPostLegenda] = useState("")
  const [newPostAvaliacao, setNewPostAvaliacao] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const data = await api.post.getAll()
        console.log(data)
        setPosts(data)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar avaliações.")
        toast.error(err.message || "Erro ao carregar avaliações.")
      } finally {
        setLoading(false)
      }
    }

    const checkLoginStatus = () => {
      const storedData = localStorage.getItem("clientData")
      if (storedData) {
        try {
          const parsedData: ClienteResponse = JSON.parse(storedData)
          setClienteData(parsedData)
          setIsLoggedIn(true)
        } catch (e) {
          console.error("Erro ao parsear dados do cliente no localStorage", e)
          localStorage.removeItem("clientData")
          setIsLoggedIn(false)
        }
      } else {
        setIsLoggedIn(false)
      }
    }

    const loadLikedPosts = () => {
      const storedLiked = localStorage.getItem("likedPosts")
      if (storedLiked) {
        try {
          setLikedPosts(new Set(JSON.parse(storedLiked)))
        } catch (e) {
          console.error("Erro ao carregar posts curtidos do localStorage", e)
          localStorage.removeItem("likedPosts")
        }
      }
    }

    fetchPosts()
    checkLoginStatus()
    loadLikedPosts()
  }, [])

  const handleCreatePost = async () => {
    if (!clienteData || !clienteData.id) {
      toast.error("Você precisa estar logado para criar uma avaliação.")
      return
    }
    if (!newPostLegenda.trim() || newPostAvaliacao === 0) {
      toast.error("Por favor, preencha a legenda e a avaliação.")
      return
    }

    setIsSubmitting(true)
    try {
      const postData: CadastroPost = {
        cliente_id: clienteData.id,
        legenda: newPostLegenda,
        avaliacao: newPostAvaliacao,
      }
      await api.post.create(postData)
      toast.success("Avaliação criada com sucesso!")
      setIsDialogOpen(false)
      setNewPostLegenda("")
      setNewPostAvaliacao(0)
      // Recarregar posts após a criação
      const updatedPosts = await api.post.getAll()
      setPosts(updatedPosts)
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar avaliação.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikePost = async (postId: number) => {
    if (!isLoggedIn || !clienteData || !clienteData.id) {
      toast.error("Você precisa estar logado para curtir/descurtir uma avaliação.")
      return
    }

    try {
      if (likedPosts.has(postId)) {
        // Se já curtiu, descurtir
        await api.post.unlikePost(postId, clienteData.id)
        toast.success("Avaliação descurtida!")
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? { ...post, qtd_curtidas: post.qtd_curtidas - 1 } : post)),
        )
        setLikedPosts((prev) => {
          const newSet = new Set(prev)
          newSet.delete(postId)
          localStorage.setItem("likedPosts", JSON.stringify(Array.from(newSet)))
          return newSet
        })
      } else {
      await api.post.likePost(postId, clienteData.id)
      toast.success("Avaliação curtida!")

      // Atualiza a contagem de curtidas localmente e marca como curtido
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? { ...post, qtd_curtidas: post.qtd_curtidas + 1 } : post)),
      )
      setLikedPosts((prev) => {
        const newSet = new Set(prev)
        newSet.add(postId)
        localStorage.setItem("likedPosts", JSON.stringify(Array.from(newSet)))
        return newSet
      })
      }
    } catch (err: any) {
        toast.error(err.message || "Erro ao curtir/descurtir avaliação.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-barbershop-900 text-white">
        <p>Carregando avaliações...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-barbershop-900 text-white">
        <p className="text-red-500">Erro: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-barbershop-900 text-black">
      <header className="flex items-center justify-between p-4 bg-barbershop-800 shadow-md">
        <div className="flex items-center gap-4">
          <Image src="/logo-costa.svg?height=60&width=60" alt="Costa Logo" width={60} height={60} />
        </div>
        <nav className="hidden md:flex space-x-6 text-lg">
              <Link href="/#about" className="hover:text-amber-500 transition-colors">
                SOBRE
              </Link>
              <Link href="/#services" className="hover:text-amber-500 transition-colors">
                SERVIÇOS
              </Link>
              <Link href="/agendamento" className="hover:text-amber-500 transition-colors">
                AGENDAR
              </Link>
              <Link href="/avaliacoes" className="hover:text-amber-500 transition-colors">
                AVALIAÇÕES
              </Link>
          </nav>

        {isLoggedIn ? (
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-barbershop-gold hover:bg-barbershop-700 text-barbershop-900"
          >
            Criar Avaliação
          </Button>
        ) : (
          <Link href="/cliente">
            <Button className="bg-barbershop-gold hover:bg-barbershop-700 text-barbershop-900">ENTRAR</Button>
          </Link>
        )}
      </header>

      <main className="container mx-auto p-6">
        <h2 className="text-4xl font-bold text-center mb-8 text-barbershop-gold">Avaliações dos Clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">
              Nenhuma avaliação encontrada. Seja o primeiro a avaliar!
            </p>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="bg-barbershop-800 text-white border-barbershop-700 shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="w-12 h-12 border-2 border-barbershop-gold">
                    <AvatarImage src={post.cliente.imagem || "/placeholder.svg"} alt={post.cliente.usuario.nome} />
                    <AvatarFallback>{post.cliente.usuario.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle className="text-xl font-semibold text-barbershop-gold">
                      {post.cliente.usuario.nome}
                    </CardTitle>
                    <StarRating rating={post.avaliacao} size={18} className="text-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-gray-300 mb-4">{post.legenda}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <Comentarios post={post} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id)}
                      disabled={!isLoggedIn} // Desabilita se não estiver logado
                      className={`flex items-center gap-1 ${likedPosts.has(post.id) ? "text-blue-400 hover:text-blue-300" : "text-gray-400 hover:text-gray-300"}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.qtd_curtidas}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-barbershop-800 text-black border-barbershop-700">
          <DialogHeader>
            <DialogTitle className="text-barbershop-gold">Criar Nova Avaliação</DialogTitle>
            <DialogDescription className="text-gray-400">
              Compartilhe sua experiência com a Costa Barbearia.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="legenda" className="text-sm font-medium text-gray-300">
                Sua Avaliação
              </label>
              <Textarea
                id="legenda"
                placeholder="Escreva sua avaliação aqui..."
                value={newPostLegenda}
                onChange={(e) => setNewPostLegenda(e.target.value)}
                className="bg-barbershop-700 border-barbershop-600 text-black focus:ring-barbershop-gold"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-300">Classificação (Estrelas)</label>
              <StarRating rating={newPostAvaliacao} onRatingChange={setNewPostAvaliacao} size={24} />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreatePost}
              disabled={isSubmitting}
              className="w-full bg-barbershop-secondary hover:border-secondary-700 text-secondary font-semibold py-3 text-lg"
            >
              {isSubmitting ? "Publicando..." : "Publicar Avaliação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
