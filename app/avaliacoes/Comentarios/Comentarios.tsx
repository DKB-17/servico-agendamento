import { useEffect, useState } from "react";
import { ClienteResponse, RegistroComentario, RegistroPost } from "@/types";
import { MessagesSquare, SendHorizontal } from 'lucide-react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ComentarioService } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Comentario } from "@/app/avaliacoes/Comentarios/Comentario";
import { api } from "@/lib/api";

export type ComentariosProps = {
    post: RegistroPost;
};

export function Comentarios({ post }: ComentariosProps) {
    const { listarComentariosComBaseEmPost } = new ComentarioService();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [clienteData, setClienteData] = useState<ClienteResponse | null>(null)
    const [comentarios, setComentarios] = useState<RegistroComentario[]>([]);
    const [comentarioPessoal, setComentarioPessoal] = useState<string>("");

    const checkLoginStatus = () => {
      const storedData = localStorage.getItem("clientData")
      if (storedData) {
        try {
          const parsedData: ClienteResponse = JSON.parse(storedData)
          setClienteData(parsedData)
          setIsLoggedIn(true)
        } catch (e) {
          console.error("Erro ao parsear dados do cliente no localStorage", e)
          localStorage.removeItem("clientData")
          setIsLoggedIn(false)
        }
      } else {
        setIsLoggedIn(false)
      }
    }

    const handleRequest = () => {
        setIsLoading(true);
        api.post.getAllComentarioToPost(post)
            .then(( data ) => {
                setComentarios(data);
            })
            .catch(() => {
                toast.error("Ocorreu um erro ao listar os comentários");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleEnviarComentario = async () => {
        if (!comentarioPessoal.trim()) {
            toast.warning("Digite um comentário antes de enviar");
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post.createComentario({texto: comentarioPessoal, cliente_id: clienteData?.id, post_id:post.id, comentario_id: null});
            console.log(response)
            toast.success("Comentário enviado com sucesso!");
            setComentarioPessoal(""); // Limpa o input
            handleRequest(); // Atualiza a lista de comentários
        } catch {
            toast.error("Ocorreu um erro ao enviar o comentário");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleRequest();
        checkLoginStatus();
    }, []);

    // Formata a data do post (opcional, ajuste conforme necessário)
    const formatarData = (data: string | Date) => {
        return new Date(data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost">
                    <MessagesSquare className="w-4 h-4 mr-2" /> Comentários
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Comentários</DrawerTitle>
                    <DrawerDescription>
                        Comentários do {post.legenda} - {formatarData(post.createdAt)}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="h-56 p-4 flex flex-col gap-4">
                    <div className="flex-auto overflow-y-auto">
                        {isLoading ? (
                            <p>Carregando comentários...</p>
                        ) : comentarios.length > 0 ? (
                            comentarios.map((comentario) => (
                                <Comentario key={comentario.id} comentario={comentario} />
                            ))
                        ) : (
                            <p>Sem comentários ainda.</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between w-full gap-4">
                        <Input
                            value={comentarioPessoal}
                            onChange={(e) => setComentarioPessoal(e.target.value)}
                            placeholder="Digite seu comentário..."
                            disabled={isLoading}
                        />
                        <Button
                            variant="ghost"
                            onClick={handleEnviarComentario}
                            disabled={isLoading}
                        >
                            <SendHorizontal className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Fechar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}