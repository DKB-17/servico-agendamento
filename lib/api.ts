import { CadastroPost, ClienteResponse, RegistroPost } from "@/types"

const API_BASE_URL = "http://localhost:8080"

export const api = {
  // Barbeiros
  barbeiros: {
    list: () => fetch(`${API_BASE_URL}/barbeiros`).then((res) => res.json()),
    get: (id: number) => fetch(`${API_BASE_URL}/barbeiros/${id}`).then((res) => res.json()),
    create: (data: any) =>
      fetch(`${API_BASE_URL}/barbeiros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (data: any) =>
      fetch(`${API_BASE_URL}/barbeiros/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    activate: (id: number) => fetch(`${API_BASE_URL}/barbeiros/${id}/ativar`, { method: "PUT" }),
    deactivate: (id: number) => fetch(`${API_BASE_URL}/barbeiros/${id}/desativar`, { method: "PUT" }),
  },

  // Serviços
  servicos: {
    list: () => fetch(`${API_BASE_URL}/servicos`).then((res) => res.json()),
    get: (id: number) => fetch(`${API_BASE_URL}/servicos/${id}`).then((res) => res.json()),
    create: (data: any) =>
      fetch(`${API_BASE_URL}/servicos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (data: any) =>
      fetch(`${API_BASE_URL}/servicos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    activate: (id: number) => fetch(`${API_BASE_URL}/servicos/${id}/ativar`, { method: "PUT" }),
    deactivate: (id: number) => fetch(`${API_BASE_URL}/servicos/${id}/desativar`, { method: "PUT" }),
  },

  // Horários
  horarios: {
    list: () => fetch(`${API_BASE_URL}/horarios`).then((res) => res.json()),
    get: (id: number) => fetch(`${API_BASE_URL}/horarios/${id}`).then((res) => res.json()),
    create: (data: any) =>
      fetch(`${API_BASE_URL}/horarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (data: any) =>
      fetch(`${API_BASE_URL}/horarios`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    activate: (id: number) => fetch(`${API_BASE_URL}/horarios/${id}/ativar`, { method: "PUT" }),
    deactivate: (id: number) => fetch(`${API_BASE_URL}/horarios/${id}/desativar`, { method: "PUT" }),
  },

  // Agendamentos
  agendas: {
    list: () => fetch(`${API_BASE_URL}/agendas`).then((res) => res.json()),
    create: (data: any) =>
      fetch(`${API_BASE_URL}/agendas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    deactivate: (id: number) => fetch(`${API_BASE_URL}/agendas/${id}/desativar`, { method: "PUT" }),
  },

  // Caixa
  caixa: {
    list: () => fetch(`${API_BASE_URL}/caixas`).then((res) => res.json()),
  },

    // Cliente
  cliente: {
    create: async (data: {nome: string; contato: string; cpf: string; email:string; senha:string}):Promise<ClienteResponse> => {
        const response = await fetch(`${API_BASE_URL}/cliente`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        return response.json()
    },
    login: async (email: string, senha: string):Promise<ClienteResponse> => {
        const response = await fetch(`${API_BASE_URL}/cliente/login`, {
          method: "POST", // Alterado de GET para POST
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }), // Credenciais no corpo da requisição
        })

        return response.json()
    },
  },

  post: {
    getAll: async (): Promise<RegistroPost[]> => {
      const response = await fetch(`${API_BASE_URL}/post`)
      return response.json()
    },
    create: async (post: CadastroPost) => {
      const response = await 
        fetch(`${API_BASE_URL}/post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(post),
        })
      return response
    },
    likePost: async (postId: number, clienteId: number) => {
      const response = await 
        fetch(`${API_BASE_URL}/post/${postId}/curtir`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cliente_id: clienteId }),
        })
      
      return response
    },
    unlikePost: async (postId: number, clienteId: number) => {
      const response = await 
        fetch(`${API_BASE_URL}/post/${postId}/descurtir`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cliente_id: clienteId }),
        })
      
      return response
    },
  },

}
