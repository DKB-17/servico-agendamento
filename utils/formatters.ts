import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Utilitários para formatação de dados

// Formatar data para exibição
export function formatarData(dateString: string): string {
  try {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  } catch {
    return dateString
  }
}

// Formatar data completa com hora
export function formatarDataCompleta(dateString: string): string {
  try {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return dateString
  }
}

// Formatar valor monetário
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor)
}

// Formatar telefone
export function formatarTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/)

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }

  return telefone
}

// Extrair apenas a hora de um horário completo
export function extrairHora(horario: string): string {
  return horario.substring(0, 5)
}
