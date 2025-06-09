"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X, Search } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Tipos para diferentes tipos de filtros
interface FilterField {
  key: string
  label: string
  type: "text" | "number" | "select" | "date" | "boolean"
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface FilterComponentProps {
  entity: string
  fields: FilterField[]
  onFilter: (filters: Record<string, any>) => void
  onClear: () => void
  loading?: boolean
}

// Componente genérico de filtros
export function FilterComponent({ entity, fields, onFilter, onClear, loading = false }: FilterComponentProps) {
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [isOpen, setIsOpen] = useState(false)

  // Atualizar valor do filtro
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Remover filtro específico
  const removeFilter = (key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  // Aplicar filtros
  const applyFilters = () => {
    // Remover valores vazios
    const cleanFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, any>,
    )

    onFilter(cleanFilters)
    setIsOpen(false)
  }

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setFilters({})
    onClear()
    setIsOpen(false)
  }

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== "" && value !== null && value !== undefined,
  ).length

  // Renderizar campo de filtro baseado no tipo
  const renderFilterField = (field: FilterField) => {
    const value = filters[field.key] || ""

    switch (field.type) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(e) => updateFilter(field.key, e.target.value)}
            placeholder={field.placeholder || `Filtrar por ${field.label.toLowerCase()}`}
            className="bg-slate-700 border-slate-600 text-black"
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => updateFilter(field.key, e.target.value ? Number(e.target.value) : "")}
            placeholder={field.placeholder || `Filtrar por ${field.label.toLowerCase()}`}
            className="bg-slate-700 border-slate-600 text-black"
          />
        )

      case "select":
        return (
          <Select value={value} onValueChange={(newValue) => updateFilter(field.key, newValue)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-black">
              <SelectValue placeholder={`Selecionar ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-black hover:bg-slate-600"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP", { locale: ptBR }) : `Selecionar ${field.label.toLowerCase()}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => updateFilter(field.key, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case "boolean":
        return (
          <Select value={value.toString()} onValueChange={(newValue) => updateFilter(field.key, newValue === "true")}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder={`Selecionar ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        )

      default:
        return null
    }
  }

  return (
    <div className="mb-6">
      {/* Botão de filtro e badges de filtros ativos */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-slate-600 text-black hover:bg-slate-700">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-amber-500 text-black">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="start">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros - {entity}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">{field.label}</Label>
                        {filters[field.key] && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFilter(field.key)}
                            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {renderFilterField(field)}
                    </div>
                  ))}

                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={applyFilters}
                      disabled={loading}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-black"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {loading ? "Filtrando..." : "Aplicar"}
                    </Button>
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      Limpar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        </div>

        {/* Badges dos filtros ativos */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters)
              .filter(([, value]) => value !== "" && value !== null && value !== undefined)
              .map(([key, value]) => {
                const field = fields.find((f) => f.key === key)
                return (
                  <Badge key={key} variant="secondary" className="bg-slate-700 text-white">
                    {field?.label}: {typeof value === "boolean" ? (value ? "Sim" : "Não") : value.toString()}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFilter(key)}
                      className="ml-1 h-4 w-4 p-0 hover:bg-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
