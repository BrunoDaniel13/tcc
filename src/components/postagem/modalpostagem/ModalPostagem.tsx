import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import FormPostagem from '../formpostagem/FormPostagem';

interface ModalPostagemProps {
  className?: string;
}

function ModalPostagem({ className }: ModalPostagemProps) {
  return (
    <Popup
      trigger={
        <button
          className={`border rounded px-4 py-2 hover:bg-white hover:text-indigo-800 cursor-pointer ${className ?? ""}`}
        >
          Nova Postagem
        </button>
      }
      modal
      contentStyle={{
        borderRadius: '1rem',
        paddingBottom: '2rem'
      }}
    >
      <FormPostagem />
    </Popup>
  );
}

export default ModalPostagem;
