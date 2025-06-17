export const API_CONFIG = {
  BASE_URL: "http://localhost:8080",
  ENDPOINTS: {
    POSTS: "/post",
    BARBEIROS: "/barbeiros",
    SERVICOS: "/servicos",
    HORARIOS: "/horarios",
    AGENDAS: "/agendas",
    CAIXAS: "/caixas",
  },
} as const

// Headers padrão para requisições
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const
