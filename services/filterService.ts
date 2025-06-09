import { API_CONFIG, DEFAULT_HEADERS } from "@/config/api"

// Serviço genérico para filtros
class FilterService {
  private baseUrl = API_CONFIG.BASE_URL

  async filtrar<T>(entity: string, filters: Record<string, any>): Promise<T[]> {
    const response = await fetch(`${this.baseUrl}/${entity}/filtro`, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(filters),
    })

    if (!response.ok) {
      throw new Error(`Erro ao filtrar ${entity}: ${response.status}`)
    }

    return response.json()
  }
}

export const filterService = new FilterService()
