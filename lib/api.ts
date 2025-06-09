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
}
