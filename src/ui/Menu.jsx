import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crearPartida } from '../store/partidaSlice.js';
import { IconoFlecha } from './Iconos.jsx';
import Vidrio from './Vidrio.jsx';
import LogoGrupo from './LogoGrupo.jsx';

// Inicio: sólo una tarjeta de vidrio centrada con los nombres (opcionales) de los
// dos jugadores, sobre el tablero que gira detrás.
export default function Menu({ onComenzar, onContinuar }) {
  const { id, cargando, error, finalizada } = useSelector((s) => s.partida);
  const despachar = useDispatch();
  const [blanco, setBlanco] = useState('');
  const [negro, setNegro] = useState('');
  const [validacionIntentada, setValidacionIntentada] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

function comenzar(evento) {
    evento.preventDefault();

    // Comprueba que se hayan introducido ambos nombres
    setValidacionIntentada(true);

    const nombreBlanco = blanco.trim();
    const nombreNegro = negro.trim();

    // Impide iniciar la partida si falta algún nombre
    if (!nombreBlanco || !nombreNegro) {
        return;
    }

    despachar(crearPartida({
        blanco: nombreBlanco,
        negro: nombreNegro
    })).unwrap()
        .then(() => {
            setSaliendo(true);
            setTimeout(onComenzar, 420);
        })
        .catch(() => {});
}

  return (
    <main className={`menu ${saliendo ? 'saliendo' : ''}`}>
      <div className="menu-logo aparecer">
        <LogoGrupo />
      </div>
      <Vidrio as="form" className="menu-tarjeta" radio={28} tinte={0.28} saliendo={saliendo} onSubmit={comenzar} aria-label="Nueva partida">
        <label className="campo">
          <span className="campo-glifo blanco" aria-hidden="true">♔</span>
          <span className="campo-cuerpo">
            <span className="campo-etiqueta">Blancas</span>
            <input
              value={blanco}
              onChange={(e) => setBlanco(e.target.value)}
              maxLength={40}
              placeholder="Jugador 1"
              autoComplete="off"
              aria-label="Nombre de quien juega con blancas"
              aria-invalid={validacionIntentada && !blanco.trim()}
              aria-describedby={validacionIntentada && !blanco.trim() ? 'error-blancas' : undefined}
            />
            {validacionIntentada && !blanco.trim() && (
        <span id="error-blancas" className="mensaje-validacion">
            Introduce el nombre del jugador de blancas.
        </span>
          )}
          </span>
        </label>
        <label className="campo">
          <span className="campo-glifo negro" aria-hidden="true">♚</span>
          <span className="campo-cuerpo">
            <span className="campo-etiqueta">Negras</span>
            <input
              value={negro}
              onChange={(e) => setNegro(e.target.value)}
              maxLength={40}
              placeholder="Jugador 2"
              autoComplete="off"
              aria-label="Nombre de quien juega con negras"
              aria-invalid={validacionIntentada && !negro.trim()}
              aria-describedby={validacionIntentada && !negro.trim() ? 'error-negras' : undefined}
            />
            {validacionIntentada && !negro.trim() && (
            <span id="error-negras" className="mensaje-validacion">
                Introduce el nombre del jugador de negras.
            </span>
          )}
          </span>
        </label>

        <button type="submit" className="boton-oro" disabled={cargando || saliendo}>
          <span>{cargando ? 'Preparando…' : 'Jugar'}</span>
          <IconoFlecha />
        </button>
        {id && (
          <button type="button" className="boton-linea" onClick={onContinuar}>
            {finalizada ? 'Ver la última partida' : 'Continuar partida'}
          </button>
        )}
        {error && <p className="error" role="alert">{error}</p>}
      </Vidrio>
    </main>
  );
}
