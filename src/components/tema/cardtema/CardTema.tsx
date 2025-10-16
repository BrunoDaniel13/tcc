import { Link } from "react-router-dom";
import type Tema from "../../../models/Temas";
import { FaEdit, FaTrash } from "react-icons/fa";

interface CardTemaProps {
  tema: Tema;
}

function CardTema({ tema }: CardTemaProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        {/* Descrição do tema */}
        <h3 className="text-xl font-bold text-indigo-700 mb-2 sm:mb-0">
          {tema.descricao}
        </h3>

        {/* Botões de ação */}
        <div className="flex gap-4">
          <Link to={`/editartema/${tema.id}`}>
            <FaEdit
              className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg"
              title="Editar"
            />
          </Link>
          <Link to={`/deletartema/${tema.id}`}>
            <FaTrash
              className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
              title="Deletar"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CardTema;
