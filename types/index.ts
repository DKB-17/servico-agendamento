export interface Barbeiro {
  id: number
  nome: string
  deletedAt?: string
  updatedAt: string
  createdAt: string
  caminhoImagem?: string | null
  servicos: Servico[]
  horarios: Horario[]
}

export interface Servico {
  id: number
  descricao: string
  valor: number
  deletedAt: string
  createdAt?: string
  updatedAt?: string
}

export interface Horario {
  id: number
  horarioInicio: string
  horarioFim: string
  deletedAt: string | null
  createdAt?: string
  updatedAt?: string
}

export interface Agendamento {
  id: number
  nome: string
  contato: string
  dia: string
  ativo: boolean
  barbeiroId?: number
  servicoId?: number
  horarioId?: number
  barbeiro?: Barbeiro
  servico?: Servico
  horario?: Horario
}

export interface AgendamentoResponse {
  id: number
  nome: string
  contato: string
  registroHorario: {
    id: number
    horarioInicio: string
    horarioFim: string
    deletedAt?: string | null
    createdAt: string
    updatedAt: string
  }
  registroServico: {
    id: number
    descricao: string
    valor: number
    createdAt: string
    updatedAt: string
  }
  registroBarbeiro: {
    id: number
    nome: string
    caminhoImagem?: string | null
    createdAt: string
    updatedAt: string
  }
  dia: string
  valor: number
  etapa: string
}

export interface CaixaData {
  totalFaturamento: number
  totalAgendamentos: number
  agendamentosHoje: number
  servicoMaisVendido: string
}

// Tipos para formulários
export interface AgendamentoForm {
  nome: string
  contato: string
  barbeiroId: string
  servicoId: string
  horarioId: string
}

export interface BarbeiroForm {
  nome: string
  servicosIds: number[]
  horariosIds: number[]
}

export interface ServicoForm {
  descricao: string
  valor: number
}

export interface HorarioForm {
  horaInicio: string
  horaFim: string
}

// Tipos para criação (enviados para API)
export interface BarbeiroCreateRequest {
  nome: string
  servicos: number[]
  horarios: number[]
}

export interface BarbeiroUpdateRequest {
  id: number
  nome: string
  caminhoImagem?: string | null
  servicos: number[]
  horarios: number[]
}

// Nova interface para o resumo de agendamentos por dia
export interface AgendamentosDiaResponse {
  agendasPendentes: number
  agendasConfirmados: number
  agendasCancelados: number
  agendasConcluidos: number
}

export interface ServicoMaisVendido {
  descricaoDoServico: string
  valorServico: number
  porcentagemDeVendas: number
  quantidadeDeVendas: number
}

export interface TicketMedio {
  valor: number
}

export interface Usuario {
  id: number
  nome: string
  contato: string
}

export interface ClienteResponse {
  id: number
  imagem: string | null
  usuario: Usuario
  createdAt: string
  updatedAt: string
}

export interface Curtida {
  id: number
  cliente_id: number
  post_id: number | null
  comentario_id: number | null
}

export interface RegistroCliente {
  id: number
  imagem: string | null
  usuario: Usuario
  createdAt: string
  updatedAt: string
}

export interface RegistroPost {
  id: number
  cliente: RegistroCliente
  legenda: string
  avaliacao: number
  qtd_curtidas: number
  curtidas: Curtida[]
  createdAt: string
  updatedAt: string
}

export interface CadastroPost {
  cliente_id: number
  legenda: string
  avaliacao: number
}
