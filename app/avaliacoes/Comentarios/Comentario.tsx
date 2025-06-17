import { RegistroComentario } from "@/types";
import { Card } from "@/components/ui/card";

export type ComentarioProps = { comentario: RegistroComentario };

export function Comentario({ comentario }: ComentarioProps) {
    return (
        <Card className="p-4 mb-4 flex flex-col gap-2 rounded-md shadow-sm">
            <p className="text-sm text-gray-800">{comentario.texto}</p>
            {comentario.createdAt && (
                <span className="text-xs text-gray-500">
                    {new Date(comentario.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            )}
        </Card>
    );
}