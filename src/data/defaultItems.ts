/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GutItem, GutLevelExplanation } from '../types';

export const DEFAULT_GUT_ITEMS: GutItem[] = [
  {
    id: '1',
    equipment: 'Transformador de Força T1 (1500kVA)',
    area: 'Cabine Primária',
    description: 'Vazamento de óleo isolante nas aletas do radiador secundário e termômetro indicando 92°C de pico sob carga média.',
    gravity: 5, // Gravíssimo (Risco de explosão / incêndio)
    urgency: 5, // Imediata (Risco iminente de colapso do ativo mais caro)
    tendency: 4, // Vai piorar rapidamente/em breve (vazamento está aumentando)
    score: 100,
    status: 'pending',
    createdAt: '2026-05-25T08:30:00Z',
    notes: 'Solicitada coleta de óleo para análise de gases dissolvidos (DGA) e termografia semanal urgentemente.',
    assignedTo: 'Equipe de Alta Tensão'
  },
  {
    id: '2',
    equipment: 'Ponte Rolante GP-02',
    area: 'Expedição de Bobinas',
    description: 'Desgaste severo nas escovas de carvão do motor de translação com fagulhamento visível sob carga nominal.',
    gravity: 4, // Grave (Paralisação total da expedição se falhar completamente)
    urgency: 4, // Muito urgente (Escovas de carvão estão na marca limite de desgaste)
    tendency: 4, // Vai piorar rapidamente (Desgaste aumenta exponencialmente com centelhamento)
    score: 64,
    status: 'in_progress',
    createdAt: '2026-05-26T10:15:00Z',
    notes: 'Substituição agendada para o fim do turno de hoje. Estoque de escovas sobressalentes já confirmado no almoxarifado.',
    assignedTo: 'Eng. Kaique (Manutenção)'
  },
  {
    id: '3',
    equipment: 'Quadro Geral de Distribuição QD-Caldeiras',
    area: 'Utilidades',
    description: 'Termografia periódica identificou ponto quente a 115°C no aperto do barramento de cobre da fase R.',
    gravity: 4, // Grave (Risco de curto-circuito bifásico/trifásico e incêndio no quadro de utilidades)
    urgency: 5, // Imediata (A temperatura ultrapassou o limite seguro de 90°C para conexões estáticas)
    tendency: 4, // Vai piorar em breve (A oxidação do cobre devido ao calor aumenta a resistência de contato de forma cumulativa)
    score: 80,
    status: 'pending',
    createdAt: '2026-05-27T07:45:00Z',
    notes: 'Necessário agendamento de parada programada de 30 minutos na caldeira para reaperto com torquímetro e aplicação de pasta de contato condutiva.',
    assignedTo: 'Técnico de Plantão'
  },
  {
    id: '4',
    equipment: 'Prensa Hidráulica PH-10 (Norma NR12)',
    area: 'Estamparia Bloco A',
    description: 'Botão de emergência (E-stop) do painel operacional com falha de retenção mecânica intermitente.',
    gravity: 5, // Gravíssimo (Risco altíssimo de acidente de trabalho grave / amputação sem parada de emergência)
    urgency: 5, // Imediata (Não se pode rodar máquina com dispositivo de segurança NR12 inoperante)
    tendency: 3, // Piora a médio prazo (Falha mecânica do botão é estática, mas o risco humano é contínuo)
    score: 75,
    status: 'pending',
    createdAt: '2026-05-27T11:00:00Z',
    notes: 'Painel foi bloqueado preventivamente com cadeado de segurança (LOTO). Aguardando recebimento de bloco de contatos NF sobressalente.',
    assignedTo: 'Equipe de Segurança / Elétrica'
  },
  {
    id: '5',
    equipment: 'Extrusora EX-04 (Aquecedor Z1)',
    area: 'Extrusão de Polímeros',
    description: 'Falta de canaleta e cobertura isolante nos terminais expostos da resistência cerâmica de 220V.',
    gravity: 4, // Grave (Risco de choque elétrico por contato acidental durante limpeza do cabeçote)
    urgency: 3, // Urgente (Necessita de intervenção na próxima parada preventiva programada)
    tendency: 2, // Pouca tendência de piorar (A fiação não irá se mover, mas a exposição ao toque é severa)
    score: 24,
    status: 'in_progress',
    createdAt: '2026-05-25T14:20:00Z',
    notes: 'Fabricação de chapa dobrada de proteção galvânica em andamento na caldeiraria interna.',
    assignedTo: 'Técnico Bruno'
  },
  {
    id: '6',
    equipment: 'Sistema de Iluminação de Emergência',
    area: 'Galpão Logístico 02',
    description: 'Conjunto de baterias chumbo-ácidas descarregando completamente em menos de 10 minutos durante testes de descarga periódica.',
    gravity: 3, // Médio (Perda parcial de luminosidade em caso de apagão, afetando a rota de evacuação)
    urgency: 3, // Urgente (Troca obrigatória por normas do Corpo de Bombeiros / AVCB)
    tendency: 3, // Irá piorar progressivamente (Sulfatação das placas de chumbo acelera a perda de carga total)
    score: 27,
    status: 'completed',
    createdAt: '2026-05-24T09:00:00Z',
    notes: 'Substituídas 4 baterias de 12V 7Ah antigas por novas baterias seladas estacionárias. Teste de autonomia de 1h realizado com sucesso.',
    assignedTo: 'Letícia (Eletricista)'
  },
  {
    id: '7',
    equipment: 'Inversor de Frequência WEG CFW11',
    area: 'Painel do Soprador de Ar',
    description: 'Filtro de poeira da grelha de ventilação do cubículo completamente obstruído por resíduos finos de processo.',
    gravity: 3, // Médio (Causa sobretemperatura interna e reduz vida útil dos capacitores de link DC)
    urgency: 2, // Pouco urgente (Pode ser aguardado o final de semana)
    tendency: 4, // Vai piorar rapidamente (Com os filtros saturados, a temperatura de junção dos IGBTs sobe a cada dia)
    score: 24,
    status: 'completed',
    createdAt: '2026-05-25T16:00:00Z',
    notes: 'Troca de manta filtrante efetuada. Limpeza com ar comprimido de baixa pressão nos dissipadores traseiros realizada.',
    assignedTo: 'Técnico Bruno'
  }
];

export const GUT_EXPLANATIONS: GutLevelExplanation[] = [
  {
    level: 1,
    label: 'Sem Danos / Sem Urgência / Sem Mudança',
    gravityDesc: 'Sem danos. Consequências mínimas se houver falha. Sem risco operacional ou de segurança.',
    urgencyDesc: 'Aceita prazo longo. Não há pressa para intervenção. Pode aguardar planejamento sem pressa.',
    tendencyDesc: 'O problema não irá se alterar com o tempo. Tendência inteiramente estática.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    level: 2,
    label: 'Mínimo / Pouco Urgente / Pouco Pior',
    gravityDesc: 'Danos leves aos equipamentos ou fiações. Reparo rápido e de baixíssimo custo. Sem risco à integridade.',
    urgencyDesc: 'Pode aguardar alguns dias ou a próxima programação ordinária sem impactos imediatos.',
    tendencyDesc: 'O problema se agrava muito lentamente ou a longo prazo (meses).',
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
  },
  {
    level: 3,
    label: 'Médio / Urgente / Pior Médio Prazo',
    gravityDesc: 'Danos moderados. Perda de redundância em painéis ou quebra de componentes parciais sem parar a fábrica toda.',
    urgencyDesc: 'Necessita atenção nas próximas semanas ou na parada preventiva do próximo ciclo.',
    tendencyDesc: 'O problema irá se agravar de forma mensurável a médio prazo (semanas).',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    level: 4,
    label: 'Grave / Muito Urgente / Pior Muito Rápido',
    gravityDesc: 'Danos graves em painéis de força ou paradas prolongadas de linha. Risco moderado de choque ou arco elétrico.',
    urgencyDesc: 'Requer ação o mais rápido possível (mesmo dia ou próximos turnos). Produção comprometida.',
    tendencyDesc: 'O problema vai deteriorar severamente se não houver um reparo em poucas horas/dias.',
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
  },
  {
    level: 5,
    label: 'Gravíssimo / Imediato / Pior Imediatamente',
    gravityDesc: 'Danos catastróficos (morte/choque fatal, explosão de transformador, incêndio). Violações pesadas de normas (NR12/NR10).',
    urgencyDesc: 'Intervenção imediata. Linha de produção totalmente parada ou desastre iminente ocorrendo agora.',
    tendencyDesc: 'Piora catastrófica ou propagação imediata se nada for feito nos próximos minutos/horas.',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  }
];
