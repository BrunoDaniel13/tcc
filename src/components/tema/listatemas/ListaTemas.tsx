import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { AuthContext } from "../../../contexts/AuthContext";
import type Tema from "../../../models/Temas";
import { buscar } from "../../../services/Service";
import CardTema from "../cardtema/CardTema";

function ListaTemas() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [temas, setTemas] = useState<Tema[]>([]);
  const { usuario, handleLogout } = useContext(AuthContext);
  const token = usuario?.token || "";

  useEffect(() => {
    buscarTemas();
  }, [token]);

  async function buscarTemas() {
    try {
      setIsLoading(true);

      if (token) {
        // Usuário logado → busca autenticada
        await buscar("/temas", setTemas, {
          headers: { Authorization: token },
        });
      } else {
        // Visitante → busca pública
        await buscar("/temas", setTemas, {});
      }

    } catch (error: any) {
      if (error.toString().includes("401") && token) {
        handleLogout();
      } else {
        console.error("Erro ao carregar temas:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center w-full my-8">
        <SyncLoader color="#312e81" size={32} />
      </div>
    );
  }

  if (temas.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-10">
        Nenhum tema foi encontrado.
      </p>
    );
  }

  return (
    <div className="container mx-auto my-8 flex flex-col gap-6">
      {temas.map((tema) => (
        <CardTema key={tema.id} tema={tema} />
      ))}
    </div>
  );
}

export default ListaTemas;
