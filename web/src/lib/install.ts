// Instalação do app (PWA), no mesmo esquema do Speak AI e do FinanceFlow:
//  - Chrome/Edge (Android e computador): abre a janela de instalação do navegador;
//  - iPhone/iPad, navegador dentro do WhatsApp/Instagram ou sem suporte: mostra o passo a passo certo.
import { useEffect, useState } from 'react';

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };

let deferred: PromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((f) => f());

if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e as PromptEvent; notify(); });
  window.addEventListener('appinstalled', () => { deferred = null; notify(); });
}

const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
const isIOS = /iPad|iPhone|iPod/.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(ua);
const isMobile = isIOS || isAndroid || /Mobi/i.test(ua);
const inApp = /FBAN|FBAV|Instagram|WhatsApp|Line\/|; wv\)|GSA\//i.test(ua);
const isSafariIOS = isIOS && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua) && !inApp;

export const installed = () => window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

/** Mostrar o botão? Sempre no celular (há instruções); no computador só quando o navegador oferece. */
export function useCanInstall(): boolean {
  const [, force] = useState(0);
  useEffect(() => { const f = () => force((n) => n + 1); listeners.add(f); return () => { listeners.delete(f); }; }, []);
  return !installed() && (isMobile || !!deferred);
}

/** Abre a instalação nativa. Retorna false quando é preciso mostrar o passo a passo. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  await deferred.prompt();
  await deferred.userChoice.catch(() => {});
  deferred = null; notify();
  return true;
}

export function installSteps(): { title: string; text: string; steps: string[] } {
  const host = location.host;
  if (inApp) return { title: 'Abra no navegador para instalar', text: 'Você abriu o link por dentro de outro app (WhatsApp, Instagram…), que não deixa instalar.', steps: [
    'Toque nos três pontinhos (⋮ ou ⋯) no canto da tela.',
    isIOS ? 'Escolha "Abrir no Safari".' : 'Escolha "Abrir no Chrome" (ou "Abrir no navegador").',
    'Na página que abrir, toque de novo em "Instalar o app".'] };
  if (isIOS && !isSafariIOS) return { title: 'No iPhone, instale pelo Safari', text: 'O iPhone só deixa instalar apps de sites pelo Safari.', steps: [
    `Copie o endereço ${host}.`, 'Abra o Safari e cole o endereço.',
    'Toque em Compartilhar (quadrado com seta para cima) e depois em "Adicionar à Tela de Início".'] };
  if (isIOS) return { title: 'Instalar no iPhone', text: 'Leva 10 segundos:', steps: [
    'Toque no botão Compartilhar (quadrado com seta para cima) na barra do Safari.',
    'Role a lista e toque em "Adicionar à Tela de Início".',
    'Toque em Adicionar. O DevQuest aparece na tela inicial.'] };
  if (isAndroid) return { title: 'Instalar no Android', text: 'Pelo menu do Chrome:', steps: [
    'Toque nos três pontinhos (⋮) no canto superior direito.',
    'Toque em "Instalar app" ou "Adicionar à tela inicial".',
    'Confirme em Instalar. Se a opção não aparecer, abra o site no Google Chrome.'] };
  return { title: 'Instalar no computador', text: 'No Chrome ou no Edge:', steps: [
    'Clique no ícone de instalar (monitor com seta) no fim da barra de endereço,',
    'ou abra o menu ⋮ › "Transmitir, salvar e compartilhar" › "Instalar página como app".',
    'Confirme em Instalar.'] };
}
