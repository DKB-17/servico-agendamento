import { API_CONFIG, DEFAULT_HEADERS } from "@/config/api"
<<<<<<< HEAD
import type {
   Barbeiro, 
   Servico, 
   Horario, 
   Agendamento, 
   BarbeiroCreateRequest, 
   BarbeiroUpdateRequest,
   AgendamentosDiaResponse, 
  } from "@/types"

import { format } from "date-fns"

=======
import type { Barbeiro, Servico, Horario, Agendamento, BarbeiroCreateRequest, BarbeiroUpdateRequest } from "@/types"
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
// Classe base para serviços da API
class BaseApiService {
  protected baseUrl = API_CONFIG.BASE_URL

  protected async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: DEFAULT_HEADERS,
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }
}

// Serviço para gerenciar barbeiros
export class BarbeiroService extends BaseApiService {
  async listar(): Promise<Barbeiro[]> {
    return this.request<Barbeiro[]>(API_CONFIG.ENDPOINTS.BARBEIROS)
  }

  async buscar(id: number): Promise<Barbeiro> {
    return this.request<Barbeiro>(`${API_CONFIG.ENDPOINTS.BARBEIROS}/${id}`)
  }

  async criar(data: BarbeiroCreateRequest): Promise<Barbeiro> {
    return this.request<Barbeiro>(API_CONFIG.ENDPOINTS.BARBEIROS, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async atualizar(data: BarbeiroUpdateRequest): Promise<Barbeiro> {
    return this.request<Barbeiro>(`${API_CONFIG.ENDPOINTS.BARBEIROS}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async ativar(id: number): Promise<void> {
    await this.request(`${API_CONFIG.ENDPOINTS.BARBEIROS}/${id}/ativar`, {
      method: "PUT",
    })
  }

  async desativar(id: number): Promise<void> {
    await this.request(`${API_CONFIG.ENDPOINTS.BARBEIROS}/${id}/desativar`, {
      method: "PUT",
    })
  }
}

// Serviço para gerenciar serviços
export class ServicoService extends BaseApiService {
  async listar(): Promise<Servico[]> {
    return this.request<Servico[]>(API_CONFIG.ENDPOINTS.SERVICOS)
  }

  async buscar(id: number): Promise<Servico> {
    return this.request<Servico>(`${API_CONFIG.ENDPOINTS.SERVICOS}/${id}`)
  }
  
  async criar(data: Omit<Servico, "id" | "createdAt" | "updatedAt">): Promise<Servico> {
    return this.request<Servico>(API_CONFIG.ENDPOINTS.SERVICOS, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async atualizar(data: Servico): Promise<Servico> {
    return this.request<Servico>(API_CONFIG.ENDPOINTS.SERVICOS, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async ativar(id: number): Promise<void> {
    await this.request(`${API_CONFIG.ENDPOINTS.SERVICOS}/${id}/ativar`, {
      method: "PUT",
    })
  }

  async desativar(id: number): Promise<void> {
    await this.request(`${API_CONFIG.ENDPOINTS.SERVICOS}/${id}/desativar`, {
      method: "PUT",
    })
  }
}

// Serviço para gerenciar horários
export class HorarioService extends BaseApiService {
  async listar(): Promise<Horario[]> {
    return this.request<Horario[]>(API_CONFIG.ENDPOINTS.HORARIOS)
  }

  async buscar(id: number): Promise<Horario> {
    return this.request<Horario>(`${API_CONFIG.ENDPOINTS.HORARIOS}/${id}`)
  }

  async criar(data: { horaInicio: string; horaFim: string }): Promise<Horario> {
    return this.request<Horario>(API_CONFIG.ENDPOINTS.HORARIOS, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async atualizar(data: Horario): Promise<Horario> {
    return this.request<Horario>(API_CONFIG.ENDPOINTS.HORARIOS, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async ativar(id: number): Promise<void> {
    await this.request(`${API_CONFIG.ENDPOINTS.HORARIOS}/${id}/ativar`, {
      method: "PUT",
    })
  }

  async desativar(id: number): Promise<void> {
    await this.request(`${API_CONFIG.ENDPOINTS.HORARIOS}/${id}/desativar`, {
      method: "PUT",
    })
  }
}

// Serviço para gerenciar agendamentos
export class AgendamentoService extends BaseApiService {
  async listar(): Promise<Agendamento[]> {
    return this.request<Agendamento[]>(API_CONFIG.ENDPOINTS.AGENDAS)
  }

  async criar(data: {
    nome: string
    contato: string
    barbeiroId: number
    servicoId: number
    horarioId: number
    dia: string
  }): Promise<Agendamento> {
    return this.request<Agendamento>(API_CONFIG.ENDPOINTS.AGENDAS, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async desativar(id: number): Promise<void> {
    await this.request(`${API_CONFIG.ENDPOINTS.AGENDAS}/${id}/desativar`, {
      method: "PUT",
    })
  }
}

<<<<<<< HEAD
// Serviço para gerenciar dados do caixa
export class CaixaService extends BaseApiService {
  async faturamentoTotal(): Promise<{ valor: number }> {
    return this.request<{ valor: number }>(`${API_CONFIG.ENDPOINTS.CAIXAS}/faturamento-total`)
  }

  async totalAgendamentos(): Promise<{ total: number }> {
    return this.request<{ total: number }>(`${API_CONFIG.ENDPOINTS.CAIXAS}/total-agendamentos`)
  }

  async agendamentosHoje(): Promise<{ total: number }> {
    return this.request<{ total: number }>(`${API_CONFIG.ENDPOINTS.CAIXAS}/agendamentos-hoje`)
  }

  async servicoMaisVendido(): Promise<{ servico: string; percentual: number }> {
    return this.request<{ servico: string; percentual: number }>(`${API_CONFIG.ENDPOINTS.CAIXAS}/servico-mais-vendido`)
  }

  async ticketMedio(): Promise<{ valor: number }> {
    return this.request<{ valor: number }>(`${API_CONFIG.ENDPOINTS.CAIXAS}/ticket-medio`)
  }

  async taxaCancelamento(): Promise<{ taxa: number }> {
    return this.request<{ taxa: number }>(`${API_CONFIG.ENDPOINTS.CAIXAS}/taxa-cancelamento`)
  }

    // Novo método para buscar agendamentos por dia
  async agendamentosPorDia(data: Date): Promise<AgendamentosDiaResponse> {
    // Formatar a data como yyyy-MM-dd para a API
    const dataFormatada = format(data, "yyyy-MM-dd")
    return this.request<AgendamentosDiaResponse>(`${API_CONFIG.ENDPOINTS.CAIXAS}/agendamentos-dia/${dataFormatada}`)
  }
}

=======
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
// Instâncias dos serviços para uso na aplicação
export const barbeiroService = new BarbeiroService()
export const servicoService = new ServicoService()
export const horarioService = new HorarioService()
export const agendamentoService = new AgendamentoService()
<<<<<<< HEAD
export const caixaService = new CaixaService()
=======
>>>>>>> 117a9383498c03862cd4c5feb5e7eddf85e333fd
