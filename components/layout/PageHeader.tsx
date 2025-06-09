import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  description: string
  backUrl: string
  backLabel: string
  children?: React.ReactNode
}

// Componente de cabeçalho reutilizável para páginas
export function PageHeader({ title, description, backUrl, backLabel, children }: PageHeaderProps) {
  return (
    <>
      {/* Botão de voltar */}
      <div className="mb-6">
        <Link href={backUrl}>
          <Button variant="ghost" className="text-white hover:text-amber-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Button>
        </Link>
      </div>

      {/* Título e ações */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-slate-300">{description}</p>
        </div>
        {children}
      </div>
    </>
  )
}
