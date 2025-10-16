import type Temas from './Temas';
import type Usuario from './Usuario';

export default interface Postagem {
  id: number;
  titulo: string;
  texto: string;
  data: string;
  temas: Temas | null;
  usuario: Usuario | null;
}