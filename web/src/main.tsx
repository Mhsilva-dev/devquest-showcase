import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { App } from './App.js';
import './lib/install.js'; // registra o service worker (app instalável)
import { Login } from './pages/Login.js';
import { Dashboard } from './pages/Dashboard.js';
import { Realm } from './pages/Realm.js';
import { Lesson } from './pages/Lesson.js';
import { Review } from './pages/Review.js';
import { Interview } from './pages/Interview.js';
import { Explore } from './pages/Explore.js';
import { Labs } from './pages/Labs.js';
import { Painel } from './pages/concursos/Painel.js';
import { Simulado } from './pages/concursos/Simulado.js';
import { Plano } from './pages/concursos/Plano.js';
import { Guia } from './pages/concursos/Guia.js';
import { FinPainel } from './pages/financas/Painel.js';
import { FinPlano } from './pages/financas/Plano.js';
import { Biblioteca } from './pages/financas/Biblioteca.js';
import { Calculadoras } from './pages/financas/Calculadoras.js';
import { Foco } from './pages/Foco.js';
import { Captura } from './pages/Captura.js';
import { Redacao } from './pages/concursos/Redacao.js';
import { MentePainel } from './pages/mente/Painel.js';
import { MenteProtocolo } from './pages/mente/Protocolo.js';
import { DiaRuim } from './pages/mente/DiaRuim.js';
import { SocialPainel } from './pages/social/Painel.js';
import { Conversa } from './pages/social/Conversa.js';
import { Mensagem } from './pages/social/Mensagem.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="realm/:id" element={<Realm />} />
          <Route path="lesson/:id" element={<Lesson />} />
          <Route path="review" element={<Review />} />
          <Route path="interview" element={<Interview />} />
          <Route path="explore" element={<Explore />} />
          <Route path="labs" element={<Labs />} />
          <Route path="concursos" element={<Painel />} />
          <Route path="concursos/materia/:id" element={<Realm track="concurso" />} />
          <Route path="concursos/simulado" element={<Simulado />} />
          <Route path="concursos/plano" element={<Plano />} />
          <Route path="concursos/guia" element={<Guia />} />
          <Route path="concursos/redacao" element={<Redacao />} />
          <Route path="concursos/redacao/:id" element={<Redacao />} />
          <Route path="foco" element={<Foco />} />
          <Route path="captura" element={<Captura />} />
          <Route path="captura/:id" element={<Captura />} />
          <Route path="concursos/revisao" element={<Review track="concurso" />} />
          <Route path="financas" element={<FinPainel />} />
          <Route path="financas/trilha/:id" element={<Realm track="financas" />} />
          <Route path="financas/plano" element={<FinPlano />} />
          <Route path="financas/biblioteca" element={<Biblioteca />} />
          <Route path="financas/biblioteca/:id" element={<Biblioteca />} />
          <Route path="financas/calculadoras" element={<Calculadoras />} />
          <Route path="financas/revisao" element={<Review track="financas" />} />
          <Route path="mente" element={<MentePainel />} />
          <Route path="mente/trilha/:id" element={<Realm track="mente" />} />
          <Route path="mente/protocolo" element={<MenteProtocolo />} />
          <Route path="mente/dia-ruim" element={<DiaRuim />} />
          <Route path="mente/biblioteca" element={<Biblioteca track="mente" />} />
          <Route path="mente/biblioteca/:id" element={<Biblioteca track="mente" />} />
          <Route path="mente/revisao" element={<Review track="mente" />} />
          <Route path="social" element={<SocialPainel />} />
          <Route path="social/trilha/:id" element={<Realm track="social" />} />
          <Route path="social/conversa" element={<Conversa />} />
          <Route path="social/conversa/:id" element={<Conversa />} />
          <Route path="social/mensagem" element={<Mensagem />} />
          <Route path="social/biblioteca" element={<Biblioteca track="social" />} />
          <Route path="social/biblioteca/:id" element={<Biblioteca track="social" />} />
          <Route path="social/revisao" element={<Review track="social" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
