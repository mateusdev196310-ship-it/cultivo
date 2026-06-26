// Mock data for the Charles Aquino APH Course

export const FEED_POSTS = [
  {
    id: 1,
    tag: "Aviso Importante",
    title: "Próxima Mentoria Ao Vivo: Técnicas de Controle de Hemorragias",
    text: "Olá, pessoal! Na próxima terça-feira (às 20h horário de Brasília), teremos nossa mentoria ao vivo exclusiva. Vamos analisar casos clínicos reais de controle de hemorragia massiva utilizando torniquetes e preenchimento de feridas. O link do Zoom estará disponível no grupo VIP dos alunos e na aba do módulo 6. Preparem suas dúvidas e nos vemos lá!",
    date: "18 Jun 2026",
    likes: 42,
    commentsCount: 8,
    author: "Charles Aquino"
  },
  {
    id: 2,
    tag: "Atualização",
    title: "Nova vídeo-análise da IA disponível no Módulo 3!",
    text: "Adicionei uma nova análise com o auxílio do nosso algoritmo de inteligência artificial sobre a avaliação da respiração no XABCDE. O vídeo foca no reconhecimento rápido de pneumotórax hipertensivo na cena. A IA ajuda a mapear os sinais clínicos visuais do paciente para tomada de decisão em segundos. Confiram na aba de Módulos!",
    date: "16 Jun 2026",
    likes: 56,
    commentsCount: 15,
    author: "Charles Aquino"
  },
  {
    id: 3,
    tag: "Dica Técnica",
    title: "A regra de ouro da Biossegurança no APH",
    text: "Lembrem-se: no atendimento pré-hospitalar, a segurança da equipe vem sempre em primeiro lugar. Nunca entre em uma cena sem os EPIs necessários (luvas, óculos de proteção, máscara e, dependendo da situação, capacete). Uma vítima já é um problema; duas vítimas é um desastre. Fiquem atentos à avaliação de cena do Módulo 2!",
    date: "12 Jun 2026",
    likes: 73,
    commentsCount: 22,
    author: "Charles Aquino"
  }
];

export const GALLERY_POSTS_INITIAL = [
  {
    id: 1,
    studentName: "Mariana Souza",
    studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    moduleIndex: 5,
    moduleTitle: "Módulo 5: Ressuscitação Cardiopulmonar (RCP)",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    caption: "Dia de treinamento prático de RCP com DEA! Cansaço físico é grande, mas a sensação de estar preparada para salvar uma vida compensa tudo. Valeu pelas dicas de postura, @CharlesAquino!",
    likes: 29,
    likedByMe: false,
    comments: [
      { id: 101, user: "Charles Aquino", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120", text: "Excelente alinhamento de ombros e quadril, Mariana! A compressão na profundidade correta (5 a 6 cm) depende exatamente dessa postura. Parabéns!", date: "1 hora atrás" },
      { id: 102, user: "Felipe Melo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120", text: "Show demais! Também fiz esse final de semana.", date: "40 min atrás" }
    ]
  },
  {
    id: 2,
    studentName: "Rodrigo Lima",
    studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    moduleIndex: 6,
    moduleTitle: "Módulo 6: Controle de Hemorragias",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
    caption: "Treinando a aplicação de torniquete de combate (CAT) em mim mesmo no tempo recorde de 15 segundos. A prática leva à perfeição!",
    likes: 41,
    likedByMe: false,
    comments: [
      { id: 201, user: "Lucas Mendes", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120", text: "Brabo demais, Rodrigo! 15s está voando.", date: "2 horas atrás" },
      { id: 202, user: "Charles Aquino", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120", text: "Excelente! A automutilação/autoaplicação em situações de estresse exige memória muscular. Continue praticando com ambos os braços.", date: "1 hora atrás" }
    ]
  },
  {
    id: 3,
    studentName: "Beatriz Costa",
    studentAvatar: "https://images.unsplash.com/photo-1534751516642-a131ffd107fd?auto=format&fit=crop&q=80&w=120",
    moduleIndex: 8,
    moduleTitle: "Módulo 8: Fraturas e Imobilizações",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    caption: "Técnica de imobilização com tala moldável e bandagens no braço. Aula super dinâmica e cheia de detalhes importantes.",
    likes: 18,
    likedByMe: false,
    comments: [
      { id: 301, user: "Juliana Ramos", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120", text: "Ficou muito boa a imobilização, Bia!", date: "Yesterday" }
    ]
  }
];

export const MODULES_DATA = [
  {
    id: 1,
    number: 1,
    title: "Fundamentos do APH e Aspectos Legais",
    subtitle: "Introdução à história do atendimento pré-hospitalar, legislação brasileira e deveres do socorrista.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder video
    videoTitle: "Fundamentos do APH - Visão Geral com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 11,
        question: "No Brasil, qual portaria do Ministério da Saúde regulamenta o Regulamento Técnico dos Sistemas Estaduais de Urgência e Emergência?",
        options: ["Portaria nº 2048/2002", "Portaria nº 186/2003", "Portaria nº 1020/2009", "Portaria nº 354/2014"],
        answer: "A",
        explanation: "A Portaria nº 2048/2002 do Ministério da Saúde é o marco regulatório do atendimento às urgências e emergências no Brasil, estabelecendo os critérios de funcionamento e equipes."
      },
      {
        id: 12,
        question: "Qual crime pode responder o cidadão comum capacitado que se recusa a prestar assistência em situação de grave e iminente perigo?",
        options: ["Homicídio culposo", "Omissão de socorro (Art. 135 do CP)", "Prevaricação", "Lesão corporal por omissão"],
        answer: "B",
        explanation: "O artigo 135 do Código Penal Brasileiro define o crime de omissão de socorro para quem deixa de prestar assistência, sem risco pessoal, à criança abandonada, extraviada ou pessoa em grave perigo."
      },
      {
        id: 13,
        question: "Qual o princípio legal que protege o socorrista ao intervir em um paciente inconsciente em estado crítico?",
        options: ["Consentimento explícito", "Consentimento implícito ou presumido", "Imunidade civil irrestrita", "Negligência justificada"],
        answer: "B",
        explanation: "O consentimento implícito ou presumido assume que qualquer pessoa em risco de morte ou incapacitação grave aceitaria receber cuidados médicos imediatos se estivesse consciente."
      },
      {
        id: 14,
        question: "Qual a definição correta de Negligência no âmbito do atendimento em emergências?",
        options: ["Agir com precipitação ou falta de cuidado sem conhecimento adequado", "Falta de ação, descuido ou inércia diante de uma obrigação técnica", "Desvio intencional do protocolo para causar danos", "Execução inadequada de técnica que o socorrista sabe realizar"],
        answer: "B",
        explanation: "Negligência é a omissão daquilo que se deveria fazer; a inércia, o descuido ou a falta de atenção em relação ao cumprimento de um dever técnico."
      },
      {
        id: 15,
        question: "Quem foi um dos principais pioneiros do APH moderno, estruturando o atendimento médico militar na guerra civil americana?",
        options: ["Dr. Jean Larrey", "Dr. Jonathan Letterman", "Dr. Alexander Fleming", "Clara Barton"],
        answer: "B",
        explanation: "O Dr. Jonathan Letterman é frequentemente chamado de 'pai do APH militar moderno' por criar um sistema de triagem, tratamento e evacuação por ambulâncias durante a Guerra Civil Americana."
      },
      {
        id: 16,
        question: "No contexto ético do socorrista, o princípio da 'Não-Maleficência' significa:",
        options: ["Fazer o bem a qualquer custo técnico", "Garantir a autonomia plena de terceiros", "Evitar infligir danos intencionais ou desnecessários ao paciente", "Distribuir os recursos de saúde de forma igualitária"],
        answer: "C",
        explanation: "O princípio da não-maleficência estabelece o dever de não causar dano ao paciente ('Primum non nocere')."
      },
      {
        id: 17,
        question: "Ao atender uma pessoa consciente que recusa o atendimento, qual deve ser a conduta inicial do socorrista?",
        options: ["Imobilizar o paciente à força e iniciar o protocolo", "Tentar argumentar, esclarecer os riscos da recusa, documentar e colher assinaturas/testemunhas", "Abandonar o local imediatamente sem registrar nada", "Chamar a polícia para prender o paciente por desacato"],
        answer: "B",
        explanation: "Se o paciente está em pleno uso de suas faculdades mentais, ele tem o direito de recusar socorro. O socorrista deve explicar os riscos, tentar persuadir, documentar e assinar a recusa com testemunhas."
      },
      {
        id: 18,
        question: "O conceito de 'Samaritano' nas leis de proteção ao socorrista em vários países visa:",
        options: ["Remunerar o atendimento voluntário", "Isentar de culpa o socorrista que age de boa-fé e dentro de seu escopo, em caso de consequências não intencionais", "Permitir cirurgias de emergência na rua", "Tornar obrigatória a prestação de serviços médicos sem salário"],
        answer: "B",
        explanation: "As leis do Bom Samaritano protegem os cidadãos que prestam socorro emergencial de boa-fé de processos de responsabilidade civil por danos ocorridos na tentativa de ajuda."
      },
      {
        id: 19,
        question: "Qual das seguintes alternativas representa uma infração ética de 'Imperícia'?",
        options: ["Esquecer de reavaliar os sinais vitais a cada 5 minutos", "Tentar realizar uma intubação endotraqueal sem possuir habilitação técnica ou treinamento prévio", "Demorar a sair da base após acionamento do rádio", "Revelar informações sigilosas do paciente para a imprensa"],
        answer: "B",
        explanation: "Imperícia é a falta de habilidade técnica ou conhecimento prático específico para realizar determinada atividade profissional pela qual o indivíduo se propõe."
      },
      {
        id: 110,
        question: "O SAMU 192 foi implantado de forma unificada em todo o território nacional através do Decreto Federal nº:",
        options: ["Decreto nº 5.055 de 2004", "Decreto nº 2.048 de 2002", "Decreto nº 7.508 de 2011", "Decreto nº 8.080 de 1990"],
        answer: "A",
        explanation: "O SAMU 192 (Serviço de Atendimento Móvel de Urgência) foi formalizado nacionalmente pelo Decreto Federal nº 5.055, de 27 de abril de 2004."
      }
    ]
  },
  {
    id: 2,
    number: 2,
    title: "Avaliação de Cena, Cinemática e Biossegurança",
    subtitle: "Como garantir a segurança da equipe de socorro, analisar os riscos circundantes e a física por trás dos traumas.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoTitle: "Avaliação de Cena de Emergência com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 21,
        question: "Ao chegar a uma cena de acidente de trânsito, qual a primeira prioridade do socorrista?",
        options: ["Retirar a vítima do veículo o mais rápido possível", "Sinalizar e garantir a segurança da cena", "Checar a responsividade da vítima", "Realizar compressões torácicas imediatas"],
        answer: "B",
        explanation: "A primeira regra de ouro do APH é a segurança da cena (socorrista, equipe, transeuntes e, por fim, a vítima). Sinalizar e mitigar riscos é a prioridade."
      },
      {
        id: 22,
        question: "Em relação ao uso de Equipamento de Proteção Individual (EPI), qual a conduta em todo e qualquer atendimento de APH?",
        options: ["Usar apenas se houver sangue visível", "Usar no mínimo luvas de procedimento e óculos de proteção como barreira biológica básica", "Luvas são dispensáveis se o socorrista for experiente", "EPIs só são necessários para médicos e enfermeiros"],
        answer: "B",
        explanation: "O contato com fluidos corporais imperceptíveis exige proteção constante. O uso de luvas e óculos protege contra infecções cruzadas de patógenos."
      },
      {
        id: 23,
        question: "A cinemática do trauma estuda as forças físicas envolvidas no evento para:",
        options: ["Calcular a velocidade exata do impacto para fins de trânsito", "Prever possíveis lesões internas não visíveis no exame inicial", "Determinar a culpa legal dos envolvidos", "Decidir se o carro tem conserto ou perda total"],
        answer: "B",
        explanation: "A cinemática ajuda a relacionar a mecânica do acidente (deformação do veículo, ejeção de ocupantes, quedas) com o índice de suspeita de lesões internas severas."
      },
      {
        id: 24,
        question: "No impacto automobilístico frontal, quais são os dois caminhos comuns de movimentação do ocupante sem cinto?",
        options: ["Ejeção vertical e rotação lateral", "Por cima do volante (tórax/cabeça) e por baixo do volante (quadril/joelhos)", "Deslizamento e capotamento do banco", "Impacto contra a porta e compressão da coluna"],
        answer: "B",
        explanation: "O ocupante sem cinto tende a seguir a trajetória 'por cima do volante' (colisão do tórax no volante e parabrisa com a cabeça) ou 'por baixo do volante' (impactando joelhos no painel e sofrendo luxação de quadril)."
      },
      {
        id: 25,
        question: "Qual das seguintes lesões é clássica na desaceleração brusca decorrente do mecanismo de 'chicote' (whiplash) na coluna cervical?",
        options: ["Fratura exposta de fêmur", "Estiramento ou ruptura de ligamentos cervicais e lesão medular", "Traumatismo craniano aberto", "Ruptura de bexiga"],
        answer: "B",
        explanation: "O movimento de hiperextensão seguido de hiperflexão do pescoço (chicote cervical) sobrecarrega os ligamentos e articulações da coluna cervical."
      },
      {
        id: 26,
        question: "Na avaliação de uma cena com suspeita de vazamento de produtos químicos perigosos, o socorrista deve se posicionar:",
        options: ["No mesmo nível e na direção em que o vento sopra (downwind)", "Em plano mais alto e contra a direção do vento (upwind)", "Mais próximo possível do tanque para ler o painel de segurança", "Dentro da zona quente para resgatar as vítimas imediatamente"],
        answer: "B",
        explanation: "Para evitar a inalação de vapores tóxicos e contato com líquidos, deve-se estacionar em local elevado (caso haja vazamento líquido) e 'upwind' (onde o vento sopra contra as costas do socorrista)."
      },
      {
        id: 27,
        question: "A colisão de um veículo contra uma árvore em que ocorre parada imediata do carro representa:",
        options: ["Desaceleração lenta", "Desaceleração rápida/impacto de alta energia", "Trauma penetrante", "Baixo índice de suspeita de trauma interno"],
        answer: "B",
        explanation: "A colisão contra objetos fixos sem deformação (árvores, postes, muros) dissipa imensa energia cinética diretamente na estrutura e nos órgãos dos ocupantes."
      },
      {
        id: 28,
        question: "A 'Tríade de Colisão' num acidente automobilístico consiste nas seguintes colisões sucessivas:",
        options: ["Do carro, do corpo contra o carro e dos órgãos internos contra a parede corporal", "Do pneu, do para-choque e do motor", "Do primeiro carro, do segundo carro e do pedestre", "Da cabeça, do pescoço e do tronco"],
        answer: "A",
        explanation: "A física do trauma define três colisões: 1) o veículo bate no obstáculo; 2) o corpo do ocupante bate no interior do veículo; 3) os órgãos internos colidem contra a estrutura óssea/muscular do corpo."
      },
      {
        id: 29,
        question: "Em uma queda de altura, qual fator físico é mais preponderante no aumento da gravidade das lesões?",
        options: ["A umidade do ar", "A altura da queda combinada com a rigidez da superfície de impacto", "O peso das roupas da vítima", "A posição inicial do salto"],
        answer: "B",
        explanation: "A energia do impacto é diretamente proporcional à altura (energia potencial gravitacional convertida em cinética) e inversamente proporcional à capacidade de amortecimento do solo."
      },
      {
        id: 210,
        question: "Qual a distância mínima de segurança recomendada para estacionar a viatura em relação a um veículo acidentado com risco de incêndio sem cabos elétricos caídos?",
        options: ["10 metros", "30 metros", "100 metros", "500 metros"],
        answer: "B",
        explanation: "Recomenda-se posicionar a viatura de APH a pelo menos 30 metros de distância, servindo como escudo protetor e fora do raio imediato de pequenas explosões ou chamas."
      }
    ]
  },
  {
    id: 3,
    number: 3,
    title: "Avaliação Primária (XABCDE do Trauma)",
    subtitle: "A abordagem sistemática que identifica e trata ameaças imediatas à vida no paciente traumatizado.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoTitle: "O Protocolo XABCDE na Prática com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 31,
        question: "O que representa a letra 'X' no início do mnemônico XABCDE?",
        options: ["Exame físico detalhado", "Exposição de fraturas ocultas", "Hemorragia exsanguinante (controle de sangramento massivo)", "Raio-X cervical obrigatório"],
        answer: "C",
        explanation: "A letra 'X' adicionada ao protocolo prioriza o controle imediato de hemorragias externas graves que podem matar o paciente em poucos minutos, antes mesmo do manejo da via aérea."
      },
      {
        id: 32,
        question: "Na etapa 'A' do XABCDE, além da abertura das vias aéreas, qual cuidado é crucial no paciente de trauma?",
        options: ["Verificar a pressão arterial sistólica", "Estabilização manual da coluna cervical", "Controle do pulso radial", "Checagem de pupilas anisocóricas"],
        answer: "B",
        explanation: "Na etapa A (Airway), deve-se manter a estabilização alinhada da coluna cervical manualmente até que o colar cervical e os coxins sejam instalados."
      },
      {
        id: 33,
        question: "Qual manobra manual de abertura de via aérea é recomendada no paciente de trauma com suspeita de lesão cervical?",
        options: ["Chin Lift (Elevação do queixo)", "Head Tilt - Chin Lift (Inclinação da cabeça)", "Jaw Thrust (Subluxação da mandíbula)", "Manobra de Heimlich"],
        answer: "C",
        explanation: "A manobra de 'Jaw Thrust' abre as vias aéreas ao tracionar a mandíbula para a frente sem movimentar ou estender o pescoço da vítima, preservando a medula."
      },
      {
        id: 34,
        question: "O que avalia especificamente a letra 'B' (Breathing) no XABCDE?",
        options: ["A presença de sangramento arterial ativo", "A qualidade da respiração, saturação de oxigênio e integridade da caixa torácica", "O nível de consciência na escala de Glasgow", "A frequência cardíaca central"],
        answer: "B",
        explanation: "A etapa 'B' (Breathing e Ventilação) avalia a frequência respiratória, expansibilidade, ausculta pulmonar e integridade mecânica do tórax."
      },
      {
        id: 35,
        question: "Como é feita a avaliação rápida da perfusão e circulação na etapa 'C' (Circulation) na triagem do APH?",
        options: ["Apenas realizando eletrocardiograma de 12 derivações", "Verificando pulso periférico/central, tempo de enchimento capilar, temperatura e cor da pele", "Medindo o débito urinário", "Analisando o reflexo patelar"],
        answer: "B",
        explanation: "Na etapa 'C', a avaliação circulatória baseia-se em parâmetros clínicos rápidos: palpação de pulso radial/carotídeo (frequência/ritmo), coloração e temperatura cutânea e tempo de enchimento capilar (normal < 2 segundos)."
      },
      {
        id: 36,
        question: "O que significa a letra 'D' (Disability) no protocolo XABCDE?",
        options: ["Desinfecção de feridas abertas", "Exame do estado neurológico (Escala de Glasgow e reatividade pupilar)", "Descompressão torácica por agulha", "Diagnóstico por imagem de fraturas"],
        answer: "B",
        explanation: "A etapa 'D' avalia a função neurológica básica, verificando a Escala de Coma de Glasgow, reatividade de pupilas e nível de alerta."
      },
      {
        id: 37,
        question: "Na etapa 'E' (Exposure), qual cuidado o socorrista deve ter logo após despir a vítima para expor lesões?",
        options: ["Lavar o paciente com água fria", "Prevenir a hipotermia cobrindo o paciente com mantas térmicas/cobertores", "Iniciar a aplicação de talas em todas as articulações", "Administrar soro fisiológico gelado via intravenosa"],
        answer: "B",
        explanation: "A hipotermia altera a cascata de coagulação e aumenta drasticamente a mortalidade do trauma. Logo após a exposição corporal (E), a vítima deve ser aquecida."
      },
      {
        id: 38,
        question: "Qual a tríade letal do trauma que o protocolo XABCDE tenta combater preventivamente?",
        options: ["Cefaleia, náusea e tontura", "Hipotermia, acidose metabólica e coagulopatia", "Hipertensão, bradicardia e arritmia", "Falta de ar, dor no peito e formigamento"],
        answer: "B",
        explanation: "A hipotermia, acidose e coagulopatia formam a tríade da morte no trauma. Cada etapa do XABCDE visa quebrar este ciclo destrutivo."
      },
      {
        id: 39,
        question: "Se um paciente apresenta pulso radial palpável, podemos estimar grosseiramente que sua pressão arterial sistólica está no mínimo acima de:",
        options: ["50 mmHg", "80-90 mmHg", "120 mmHg", "140 mmHg"],
        answer: "B",
        explanation: "Historicamente, a presença de pulso radial indica perfusão periférica com pressão sistólica estimada de pelo menos 80 a 90 mmHg (embora deva ser mensurada formalmente)."
      },
      {
        id: 310,
        question: "Durante a etapa 'A', o paciente emite sons guturais e ruidosos (roncos). O que isso indica?",
        options: ["Respiração normal profunda", "Obstrução parcial de via aérea por língua ou secreção", "Excelente expansibilidade alveolar", "Parada cardiorrespiratória iminente com pulso preservado"],
        answer: "B",
        explanation: "Ruídos na respiração indicam fluxo de ar turbulento decorrente de obstrução parcial física (queda da base da língua contra a faringe ou secreções acumuladas)."
      }
    ]
  },
  {
    id: 4,
    number: 4,
    title: "Obstrução de Vias Aéreas (OVACE) e Oxigenoterapia",
    subtitle: "Reconhecimento rápido de engasgos em adultos, crianças e bebês, manobras de desobstrução e suplementação de O2.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoTitle: "Manobras de OVACE com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 41,
        question: "Qual a manobra de escolha para desobstrução de via aérea por corpo estranho em adultos conscientes?",
        options: ["Manobra de Heimlich (compressões subdiafragmáticas)", "Manobra de Sellick", "Manobra de Valsalva", "Varredura digital às cegas na boca"],
        answer: "A",
        explanation: "A manobra de Heimlich baseia-se em compressões abdominais rápidas para dentro e para cima, elevando o diafragma e gerando tosse artificial por pressão intratorácica."
      },
      {
        id: 42,
        question: "Como deve ser feita a manobra de desobstrução de via aérea em um bebê (lactente < 1 ano) consciente?",
        options: ["Compressões abdominais fortes em pé", "5 golpes dorsais alternados com 5 compressões torácicas com o bebê apoiado no antebraço e cabeça inclinada para baixo", "Sacudir o bebê pelas pernas", "Fazer respiração boca-a-boca contínua"],
        answer: "B",
        explanation: "Para bebês, a anatomia hepática e esplênica impede compressões abdominais. Fazem-se 5 pancadas nas costas (interescapular) e 5 compressões torácicas (linha intermamilar)."
      },
      {
        id: 43,
        question: "Ao realizar a manobra de Heimlich em um adulto, ele perde a consciência e desaba. Qual a conduta correta imediata?",
        options: ["Continuar as compressões abdominais no chão", "Iniciar o protocolo de RCP (começando por compressões torácicas) e inspecionar a cavidade oral a cada ciclo de ventilações", "Realizar traqueostomia de emergência", "Apenas aguardar o SAMU"],
        answer: "B",
        explanation: "Quando o paciente com OVACE evolui para inconsciência, o socorrista inicia RCP. As compressões no peito ajudam a expelir o objeto e mantêm perfusão miocárdica."
      },
      {
        id: 44,
        question: "Em mulheres grávidas no terceiro trimestre ou obesos graves com OVACE consciente, onde devem ser feitas as compressões de desobstrução?",
        options: ["No estômago, com menor intensidade", "Na metade inferior do osso esterno (tórax)", "Nas costas, com o paciente deitado", "Na garganta diretamente"],
        answer: "B",
        explanation: "Grávidas avançadas e obesos não toleram compressões abdominais. Deve-se fazer compressões torácicas no esterno para gerar a pressão torácica."
      },
      {
        id: 45,
        question: "Qual dispositivo de oxigenoterapia de baixo fluxo fornece concentrações de O2 de 24% a 44% e é bem tolerado pelo paciente?",
        options: ["Máscara de Venturi", "Cânula nasal tipo óculos (cateter tipo óculos)", "Máscara com reservatório não reinalante", "Tubo endotraqueal"],
        answer: "B",
        explanation: "O cateter nasal é um dispositivo de baixo fluxo simples, confortável, que fornece fluxo de 1 a 6 litros por minuto de oxigênio."
      },
      {
        id: 46,
        question: "Para fornecer concentrações de oxigênio próximas a 90%-100% em APH no paciente em respiração espontânea, qual dispositivo é o mais indicado?",
        options: ["Cateter nasal a 2 L/min", "Máscara simples de oxigênio", "Máscara com reservatório não reinalante (fluxo de 12 a 15 L/min)", "Máscara de Venturi ajustada a 30%"],
        answer: "C",
        explanation: "A máscara com reservatório não reinalante acumula oxigênio no balão e possui válvulas unidirecionais que impedem a reinalação de gás carbônico expirado, garantindo alta fração inspirada."
      },
      {
        id: 47,
        question: "A manobra de 'varredura digital' às cegas na boca do paciente engasgado está indicada em qual situação?",
        options: ["Sempre que o paciente estiver inconsciente", "Nunca deve ser realizada às cegas (apenas quando o objeto for claramente visível e alcançável na cavidade oral)", "Sempre em bebês", "Como primeira medida em adultos engasgados"],
        answer: "B",
        explanation: "A varredura digital cega pode empurrar o corpo estranho mais profundamente na laringe, piorando a obstrução. Faça apenas sob visualização direta."
      },
      {
        id: 48,
        question: "O que caracteriza a obstrução total da via aérea (OVACE grave) no paciente consciente?",
        options: ["Tosse forte e choro alto", "Capacidade de falar frase completas", "Incapacidade de falar, tossir efetivamente ou respirar, e sinal universal do engasgo (mãos no pescoço)", "Espirros frequentes e vermelhidão"],
        answer: "C",
        explanation: "A obstrução total impede a passagem de ar pelas cordas vocais, impossibilitando a fala, a tosse eficaz ou a emissão de qualquer som."
      },
      {
        id: 49,
        question: "Qual a função da Cânula de Guedes (cânula orofaríngea)?",
        options: ["Garantir a via aérea definitiva por balão inflável", "Evitar que a língua caia contra a parede posterior da faringe em pacientes inconscientes", "Substituir a intubação orotraqueal em paradas cardíacas", "Aspirar secreções do esôfago"],
        answer: "B",
        explanation: "A cânula de Guedes mantém a via aérea pérvia em pacientes sem reflexo de vômito, servindo de canal sobre a língua."
      },
      {
        id: 410,
        question: "A cânula orofaríngea (Guedes) pode ser inserida em pacientes conscientes?",
        options: ["Sim, ajuda a respirar", "Não, pois pode estimular o reflexo de vômito (gagueira) e provocar laringoespasmo/aspiração", "Apenas se tiver secreção", "Sim, desde que lubrificada com anestésico local"],
        answer: "B",
        explanation: "A presença da cânula em paciente com reflexo de deglutição preservado desencadeia náuseas, vômitos e laringoespasmos perigosos."
      }
    ]
  },
  {
    id: 5,
    number: 5,
    title: "Ressuscitação Cardiopulmonar (RCP) e Uso do DEA",
    subtitle: "Diretrizes atualizadas para compressões torácicas de alta qualidade, ventilação e manuseio do Desfibrilador Externo Automático.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoTitle: "Treinamento de RCP e DEA com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 51,
        question: "Qual a frequência recomendada de compressões torácicas na RCP em adultos segundo as diretrizes de reanimação?",
        options: ["60 a 80 compressões por minuto", "80 a 100 compressões por minuto", "100 a 120 compressões por minuto", "140 a 160 compressões por minuto"],
        answer: "C",
        explanation: "A taxa recomendada é de 100 a 120 compressões por minuto. Ritmo inferior ou superior reduz a perfusão coronária e cerebral efetiva."
      },
      {
        id: 52,
        question: "Qual a profundidade recomendada para as compressões torácicas em um paciente adulto?",
        options: ["Pelo menos 3 cm, sem ultrapassar 4 cm", "Pelo menos 5 cm, sem ultrapassar 6 cm", "Pelo menos 7 cm", "Qualquer profundidade desde que seja rápida"],
        answer: "B",
        explanation: "A compressão deve ter entre 5 e 6 cm de profundidade no adulto para ejetar sangue do ventrículo esquerdo efetivamente, sem causar fraturas costais severas."
      },
      {
        id: 53,
        question: "Qual a relação ideal entre compressões e ventilações em RCP de adulto com um ou dois socorristas (sem via aérea avançada)?",
        options: ["15 compressões para 2 ventilações (15:2)", "30 compressões para 2 ventilações (30:2)", "5 compressões para 1 ventilação (5:1)", "Apenas compressões, sem ventilação em nenhum caso"],
        answer: "B",
        explanation: "A proporção padrão é 30 compressões para 2 ventilações (30:2) para otimizar fluxo coronário e oxigenação no paciente sem via aérea avançada."
      },
      {
        id: 54,
        question: "O que deve ser feito imediatamente após a chegada do DEA na cena de uma parada cardiorrespiratória?",
        options: ["Ligar o aparelho e seguir suas instruções de voz", "Aplicar os eletrodos no tórax do paciente antes de ligar", "Carregar o botão de choque manualmente", "Fazer mais 5 minutos de compressões antes de usar o aparelho"],
        answer: "A",
        explanation: "A primeira ação com o DEA é ligar o aparelho. A partir daí, o dispositivo guia verbalmente todo o atendimento passo a passo."
      },
      {
        id: 55,
        question: "Quais são os dois ritmos de parada cardíaca em que o choque (desfibrilação) do DEA está indicado?",
        options: ["Assistolia e Atividade Elétrica Sem Pulso (AESP)", "Fibrilação Ventricular (FV) e Taquicardia Ventricular sem Pulso (TVSP)", "Fibrilação Atrial e Bradicardia Sinusal", "Bloqueio Atrioventricular de 3º grau e Taquicardia Supraventricular"],
        answer: "B",
        explanation: "O DEA apenas recomenda choque para ritmos 'chocáveis': Fibrilação Ventricular e Taquicardia Ventricular Sem Pulso. Assistolia e AESP não têm indicação de choque."
      },
      {
        id: 56,
        question: "Durante a análise do ritmo cardíaco pelo DEA, qual a conduta dos socorristas na cena?",
        options: ["Continuar as compressões com mais força", "Afastar-se do paciente e garantir que ninguém toque nele", "Verificar a respiração da vítima", "Administrar ventilação com pressão positiva"],
        answer: "B",
        explanation: "Tocar na vítima durante a análise do DEA gera artefatos de movimento que interferem na leitura correta do ritmo e podem atrasar o choque."
      },
      {
        id: 57,
        question: "O que significa 'retorno elástico total do tórax' entre as compressões torácicas?",
        options: ["Parar as compressões para o tórax respirar", "Permitir que o esterno volte à sua posição neutra original, aliviando o peso das mãos sem perder o contato com a pele", "Fazer o paciente tossir", "Comprimir a metade da profundidade na segunda metade do ciclo"],
        answer: "B",
        explanation: "Permitir o retorno completo do tórax é essencial para que ocorra o enchimento das câmaras cardíacas (retorno venoso) antes da próxima compressão."
      },
      {
        id: 58,
        question: "Em caso de afogamento ou parada de etiologia respiratória primária, o protocolo de RCP deve priorizar:",
        options: ["Compressões exclusivas (Hands-Only)", "Ciclos de compressão e ventilação desde o início do atendimento", "Uso imediato do torniquete", "Transporte rápido sem nenhuma manobra na cena"],
        answer: "B",
        explanation: "Paradas de origem respiratória (afogamento, asfixia, overdose) cursam com hipóxia severa inicial. Ventilações precoces são fundamentais nesse cenário."
      },
      {
        id: 59,
        question: "Se o DEA disparar um choque, o que os socorristas devem fazer imediatamente a seguir?",
        options: ["Checar o pulso carotídeo da vítima", "Retomar as compressões torácicas imediatamente (iniciar novo ciclo de 2 minutos de RCP)", "Desligar o DEA", "Administrar adrenalina"],
        answer: "B",
        explanation: "Após a descarga do DEA, deve-se reiniciar imediatamente as compressões torácicas por 2 minutos. Não se perde tempo checando pulso logo após o choque."
      },
      {
        id: 510,
        question: "Em lactentes (bebês < 1 ano), qual a técnica de compressão manual para um único socorrista?",
        options: ["Técnica de dois dedos no centro do tórax (logo abaixo da linha intermamilar)", "Técnica dos dois polegares circundando o tórax", "Utilizar a palma de uma das mãos", "Utilizar as duas mãos sobrepostas"],
        answer: "A",
        explanation: "Para um socorrista isolado em bebê, a técnica de dois dedos é indicada. Se houver dois socorristas, a técnica dos dois polegares circundando o tórax é preferida."
      }
    ]
  },
  {
    id: 6,
    number: 6,
    title: "Controle de Hemorragias e Choque",
    subtitle: "Identificação de hemorragias massivas, técnicas de pressão direta, preenchimento de feridas e aplicação segura do torniquete.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoTitle: "Controle de Hemorragias Massivas com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 61,
        question: "Qual o método de escolha inicial mais simples e eficaz para controlar um sangramento externo moderado no APH?",
        options: ["Aplicação de torniquete na raiz do membro", "Pressão direta sobre o ferimento com gaze limpa ou curativo compressivo", "Elevação dos membros inferiores", "Garroteamento com barbante"],
        answer: "B",
        explanation: "A pressão direta bloqueia o fluxo de sangue localmente e estimula a formação do coágulo primário."
      },
      {
        id: 62,
        question: "Em caso de hemorragia arterial massiva e catastrófica em membro superior ou inferior (exsanguinação), qual a conduta imediata?",
        options: ["Realizar preenchimento de ferida com gaze simples", "Aplicar torniquete comercial (tipo CAT) o mais rápido possível", "Aplicar gelo local", "Apenas elevar o membro acima do coração"],
        answer: "B",
        explanation: "Hemorragias arteriais graves em membros são emergências extremas. O torniquete deve ser a primeira intervenção para cessar a perda volêmica letal imediatamente."
      },
      {
        id: 63,
        question: "Onde deve ser posicionado o torniquete em relação ao ferimento em caso de hemorragia grave de membro?",
        options: ["Sempre exatamente sobre a articulação mais próxima", "Cerca de 5 a 7 cm acima do ferimento (nunca sobre articulação) ou 'alto e apertado' (high and tight) na raiz do membro se a localização exata do sangramento for incerta", "Abaixo do ferimento", "Exatamente em cima do corte principal"],
        answer: "B",
        explanation: "O torniquete deve ficar entre o coração e a lesão, de 5 a 7 cm acima desta, ou na raiz do membro (axila/virilha) em cenários caóticos de múltiplas lesões."
      },
      {
        id: 64,
        question: "Como se avalia a eficácia da aplicação de um torniquete?",
        options: ["Quando o paciente reclama de dor intensa", "Com a interrupção do sangramento ativo e desaparecimento do pulso distal do membro acometido", "Quando o membro fica vermelho e quente", "Pela contagem do tempo de aplicação"],
        answer: "B",
        explanation: "O torniquete é eficaz quando atinge pressão arterial oclusiva, cessando o sangramento visível e extinguindo o pulso palpável distalmente."
      },
      {
        id: 65,
        question: "Qual tipo de ferimento anatômico é ideal para a técnica de 'Preenchimento de Ferida' (Wound Packing)?",
        options: ["Ferimentos penetrantes em áreas de transição/juncionais (virilha, axila, pescoço) onde o torniquete não pode ser aplicado", "Fraturas expostas cranianas", "Feridas abdominais com exposição de alças intestinais (evisceração)", "Pequenos arranhões superficiais"],
        answer: "A",
        explanation: "As regiões juncionais (axila, virilha) possuem vasos calibrosos mas não aceitam torniquete. O preenchimento com gaze (preferencialmente hemostática) e compressão manual contínua por 3 min é o padrão de tratamento."
      },
      {
        id: 66,
        question: "O choque hipovolêmico decorrente de sangramento severo se caracteriza na fase inicial por:",
        options: ["Hipertensão arterial e bradicardia", "Taquicardia, pele fria e pegajosa, taquipneia e hipotensão na fase descompensada", "Aumento do nível de consciência e euforia", "Pele quente, corada e seca"],
        answer: "B",
        explanation: "O corpo tenta compensar a perda de volume acelerando o coração (taquicardia) e desviando o sangue para órgãos vitais por vasoconstrição (pele pálida e fria)."
      },
      {
        id: 67,
        question: "Um torniquete pode ficar aplicado com segurança por até quantas horas sem causar danos irreversíveis ao membro?",
        options: ["30 minutos", "Até 2 horas", "6 a 8 horas", "24 horas"],
        answer: "B",
        explanation: "Estudos clínicos mostram que a aplicação do torniquete por até 120 minutos (2 horas) é altamente segura e raramente resulta em complicações neurológicas ou musculares permanentes."
      },
      {
        id: 68,
        question: "Ao aplicar um torniquete, qual informação crítica deve ser obrigatoriamente escrita na fita de registro do dispositivo?",
        options: ["O nome do socorrista", "O horário exato da aplicação", "O tipo sanguíneo do paciente", "A pressão arterial média estimada"],
        answer: "B",
        explanation: "O horário de aplicação do torniquete (Time) permite que as equipes hospitalares calculem a janela segura de isquemia antes da liberação cirúrgica."
      },
      {
        id: 69,
        question: "Qual das seguintes alternativas representa um erro grave na aplicação do torniquete?",
        options: ["Escreve o horário na fita de identificação", "Afrouxar periodicamente o torniquete para 'testar' se o sangramento parou", "Colocar o torniquete diretamente na pele", "Apertar a haste giratória (molinete) até cessar o sangramento"],
        answer: "B",
        explanation: "NUNCA se deve afrouxar o torniquete após aplicado. A liberação intermitente reativa a hemorragia massiva e pode induzir choque irreversível e liberação de toxinas isquêmicas na circulação."
      },
      {
        id: 610,
        question: "O que deve ser feito caso o primeiro torniquete aplicado não consiga estancar completamente o sangramento em um membro?",
        options: ["Remover o primeiro torniquete imediatamente", "Aplicar um segundo torniquete imediatamente acima do primeiro, lado a lado", "Apenas aguardar o sangramento cessar sozinho", "Fazer torniquete no outro membro saudável"],
        answer: "B",
        explanation: "Se o primeiro torniquete falhar (comum em coxas volumosas), aplica-se um segundo torniquete logo acima do primeiro para somar força de oclusão arterial."
      }
    ]
  },
  {
    id: 7,
    number: 7,
    title: "Trauma Cranioencefálico (TCE) e Trauma Raquimedular (TRM)",
    subtitle: "Identificação de fraturas de crânio, concussão, lesões medulares e os protocolos de restrição de movimento da coluna.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoTitle: "Protocolos de TCE e TRM no APH com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 71,
        question: "Qual escala clínica é amplamente utilizada internacionalmente para avaliar o nível de consciência e gravidade do TCE?",
        options: ["Escala de Cincinnati", "Escala de Coma de Glasgow (ECG)", "Escala de APGAR", "Escala de Ramsay"],
        answer: "B",
        explanation: "A Escala de Coma de Glasgow avalia três parâmetros principais: abertura ocular, resposta verbal e resposta motora (pontuação de 3 a 15)."
      },
      {
        id: 72,
        question: "A Tríade de Cushing, indicativa de aumento grave da pressão intracraniana (hipertensão intracraniana), é composta por:",
        options: ["Taquicardia, hipotensão e taquipneia", "Bradicardia, hipertensão arterial (com pressão de pulso divergente) e padrão respiratório irregular", "Febre, rigidez de nuca e vômitos em jato", "Sonolência, sudorese e pupilas mióticas"],
        answer: "B",
        explanation: "A tríade de Cushing é um reflexo autonômico tardio e grave de herniação cerebral iminente, consistindo em hipertensão, bradicardia e respiração irregular."
      },
      {
        id: 73,
        question: "Ao avaliar pupilas no TCE, o socorrista identifica que uma pupila está bem dilatada (midríase) e a outra está normal (contraída). Como se classifica essa condição?",
        options: ["Isocoria", "Miose bilateral", "Anisocoria", "Pupilas fotorreativas simétricas"],
        answer: "C",
        explanation: "Anisocoria é a desigualdade no diâmetro das pupilas. No trauma, indica frequentemente compressão do terceiro par craniano decorrente de edema ou hematoma intracraniano expansivo do mesmo lado dilatado."
      },
      {
        id: 74,
        question: "Qual sinal clínico de fratura de base de crânio se caracteriza por equimose retroauricular (atrás da orelha)?",
        options: ["Sinal de Guaxinim", "Sinal de Battle", "Sinal de Romberg", "Sinal de Murphy"],
        answer: "B",
        explanation: "O Sinal de Battle é a equimose sobre a apófise mastoide, surgindo horas após fraturas da fossa média do crânio."
      },
      {
        id: 75,
        question: "O que é o 'Sinal de Olho de Guaxinim' (equimose periorbitária bilateral) no trauma craniano?",
        options: ["Indicativo de fratura da fossa anterior da base de crânio", "Sinal de infecção ocular aguda", "Sinal de glaucoma secundário", "Sinal de fratura de mandíbula"],
        answer: "A",
        explanation: "O acúmulo de sangue ao redor das órbitas oculares (Sinal de Guaxinim) é indicativo clássico de fratura da fossa craniana anterior."
      },
      {
        id: 76,
        question: "Qual a recomendação atual das diretrizes do PHTLS sobre a colocação de prancha rígida longa para todos os pacientes de trauma?",
        options: ["A prancha rígida deve ser usada sempre, em 100% dos acidentes", "A prancha rígida longa deve ter uso restrito a indicações específicas e serve principalmente como dispositivo de transporte/extricação, não devendo o paciente permanecer nela por longos períodos", "A prancha rígida foi banida totalmente do APH e destruída", "A prancha deve ser usada apenas em crianças de colo"],
        answer: "B",
        explanation: "Diretrizes modernas indicam a Restrição de Movimentos da Coluna (RMC) seletiva. O uso indiscriminado da prancha gera dor, úlceras de pressão e compromete a mecânica respiratória."
      },
      {
        id: 77,
        question: "Qual o principal sintoma que levanta suspeita imediata de trauma raquimedular (TRM) no paciente consciente?",
        options: ["Dor à palpação da coluna, parestesia (formigamento) ou perda de sensibilidade e motricidade nos membros", "Dor de cabeça intensa", "Sangramento abundante no couro cabeludo", "Dificuldade de audição"],
        answer: "A",
        explanation: "Alterações neurológicas sensitivas ou motoras em extremidades (parestesia, paralisia, fraqueza) apontam para comprometimento medular até prova em contrário."
      },
      {
        id: 78,
        question: "Qual a conduta correta ao remover o capacete de um motociclista acidentado com suspeita de TRM?",
        options: ["Retirar de uma vez puxando para cima rapidamente", "Retirar obrigatoriamente a duas pessoas, mantendo alinhamento manual neutro da coluna cervical durante todo o processo", "Cortar o capacete com uma serra", "Nunca retirar o capacete no APH, deixando-o no hospital"],
        answer: "B",
        explanation: "A remoção exige técnica coordenada: um socorrista mantém alinhamento cervical pela mandíbula/nuca enquanto o outro expande as laterais do capacete e o desliza cuidadosamente para fora."
      },
      {
        id: 79,
        question: "Em qual das seguintes pontuações na Escala de Coma de Glasgow o paciente é considerado em estado de coma grave, indicando necessidade de manejo de via aérea avançada (intubação)?",
        options: ["Glasgow 15", "Glasgow 12", "Glasgow 8 ou menor", "Glasgow 10"],
        answer: "C",
        explanation: "Um Glasgow igual ou menor que 8 define coma grave e indica perda dos reflexos protetores de via aérea, com indicação de intubação orotraqueal."
      },
      {
        id: 710,
        question: "Qual das seguintes alterações pupilares indica lesão cerebral gravíssima ou morte encefálica iminente no paciente traumatizado?",
        options: ["Pupilas isocóricas fotorreativas", "Pupilas mióticas puntiformes fotorreativas", "Pupilas midriáticas bilaterais fixas (paralisadas sem reação à luz)", "Pupilas normais em luz brilhante"],
        answer: "C",
        explanation: "Pupilas dilatadas e que não respondem à estimulação luminosa (midríase paralítica bilateral) sugerem herniação cerebral grave do tronco encefálico ou anóxia cerebral severa."
      }
    ]
  },
  {
    id: 8,
    number: 8,
    title: "Fraturas, Luxações e Imobilizações",
    subtitle: "Manejo de fraturas expostas e fechadas, técnicas de alinhamento, talas moldáveis e tração de fêmur.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoTitle: "Imobilizações Práticas no APH com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 81,
        question: "Qual a regra básica de ouro ao realizar a imobilização de uma fratura de osso longo?",
        options: ["Imobilizar apenas o local exato da quebra", "Imobilizar a articulação acima e a articulação abaixo do osso fraturado", "Passar pomada anti-inflamatória antes de engessar", "Tentar recolocar o osso quebrado no lugar à força"],
        answer: "B",
        explanation: "Para anular os movimentos dos fragmentos ósseos, é obrigatório estabilizar as articulações proximal e distal à fratura."
      },
      {
        id: 82,
        question: "Qual a primeira conduta em caso de Fratura Exposta com sangramento ativo moderado?",
        options: ["Introduzir o fragmento ósseo exposto para dentro do membro", "Controlar a hemorragia com curativo compressivo estéril úmido sobre a lesão (sem empurrar o osso) e imobilizar o membro na posição encontrada", "Lavar o osso exposto com álcool gel", "Aplicar torniquete imediatamente, mesmo sem hemorragia grave"],
        answer: "B",
        explanation: "Deve-se proteger a exposição óssea com curativo estéril úmido (com soro fisiológico) para evitar contaminação e ressecamento. Nunca force o osso de volta."
      },
      {
        id: 83,
        question: "Antes e depois de aplicar qualquer tala de imobilização em um membro fraturado, o que o socorrista deve avaliar obrigatoriamente?",
        options: ["A temperatura corporal axilar", "O pulso distal, perfusão capilar, cor e sensibilidade do membro (avaliação neurovascular distal)", "A pupila do paciente", "O nível de glicose capilar"],
        answer: "B",
        explanation: "A verificação do pulso e sensibilidade periféricos (antes e depois) garante que a imobilização não comprimiu vasos sanguíneos ou nervos importantes."
      },
      {
        id: 84,
        question: "A fratura fechada bilateral de fêmur apresenta um risco sistêmico grave devido a:",
        options: ["Possibilidade de infecção óssea imediata", "Potencial perda sanguínea interna volumosa de até 1000-1500 ml por fêmur, levando ao choque hemorrágico", "Danos ao nervo óptico", "Risco de pneumonia nosocomial"],
        answer: "B",
        explanation: "O fêmur é cercado por musculatura ricamente vascularizada. Uma fratura femoral pode acumular grande volume de sangue no interior da coxa."
      },
      {
        id: 85,
        question: "Qual dispositivo de imobilização é especificamente indicado para o alinhamento e estabilização de fraturas da diáfise do fêmur no APH?",
        options: ["Tala de papelão simples", "Tala de tração fêmur (tração de fêmur portátil)", "Tapa-olho de acetato", "Colar cervical tamanho G"],
        answer: "B",
        explanation: "A tala de tração femoral puxa o membro longitudinalmente, alinhando o osso, diminuindo o espasmo muscular doloroso e reduzindo o espaço de sangramento interno."
      },
      {
        id: 86,
        question: "O que diferencia uma luxação de uma fratura?",
        options: ["A luxação é o deslocamento de uma articulação para fora de sua posição anatômica normal (perda de contato articular); a fratura é a quebra da integridade óssea", "Luxação é apenas uma fratura leve", "Na luxação o osso sempre atravessa a pele", "Fraturas não causam dor, luxações causam"],
        answer: "A",
        explanation: "Luxação é o desalinhamento articular permanente. Fratura refere-se à perda de continuidade da cortical do tecido ósseo."
      },
      {
        id: 87,
        question: "Ao atender uma vítima de luxação de cotovelo com ausência de pulso distal no braço afetado, qual a conduta imediata recomendada?",
        options: ["Engessar o cotovelo dobrado", "Realizar uma tração leve e suave em linha reta no membro para tentar reestabelecer o fluxo sanguíneo (se permitido por protocolo local) e transportar em emergência absoluta", "Aguardar 24 horas para ver se o pulso volta", "Aplicar calor úmido no local"],
        answer: "B",
        explanation: "A ausência de pulso distal indica isquemia aguda por compressão vascular. O rebatimento ou tração suave pode descomprimir a artéria antes de causar necrose do membro."
      },
      {
        id: 88,
        question: "Para imobilizar uma articulação lesionada (ex: entorse ou luxação de tornozelo), a regra é:",
        options: ["Imobilizar o osso acima e o osso abaixo da articulação afetada", "Apenas massagear com pomada gelada", "Imobilizar apenas a articulação sem prender os ossos", "Não imobilizar, apenas colocar gelo"],
        answer: "A",
        explanation: "Da mesma forma que fraturas de ossos exigem imobilizar as articulações adjacentes, lesões nas articulações exigem a imobilização dos ossos proximal e distal a ela."
      },
      {
        id: 89,
        question: "Qual o principal sintoma da 'Síndrome Compartimental' após imobilização apertada de um membro?",
        options: ["Dor desproporcional à lesão, palidez, ausência de pulso (tardio), parestesia e rigidez muscular (membro tenso)", "Febre alta", "Urina avermelhada imediata", "Aumento da sudorese facial"],
        answer: "A",
        explanation: "A síndrome compartimental resulta do aumento de pressão dentro de um compartimento muscular fechado, comprometendo a perfusão capilar. A dor severa e contínua é o principal sinal de alerta."
      },
      {
        id: 810,
        question: "Qual dispositivo de APH é o mais versátil e indicado para moldar e estabilizar fraturas de membros superiores na rua?",
        options: ["Prancha rígida", "Tala moldável de alumínio revestida em EVA (tipo SAM Splint)", "Tala gessada industrializada", "Colar cervical"],
        answer: "B",
        explanation: "As talas moldáveis de alumínio/EVA são leves, flexíveis e podem ser facilmente cortadas e dobradas para ajustar-se a qualquer membro."
      }
    ]
  },
  {
    id: 9,
    number: 9,
    title: "Queimaduras e Emergências Clínicas",
    subtitle: "Classificação de queimaduras, cálculo de superfície corporal queimada (Regra dos 9), infarto, AVC e crises convulsivas.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoTitle: "Queimaduras e Casos Clínicos no APH com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 91,
        question: "No atendimento inicial a uma queimadura térmica local, qual deve ser a primeira conduta terapêutica na cena?",
        options: ["Aplicar creme dental ou manteiga para aliviar a dor", "Resfriar a lesão com água corrente limpa em temperatura ambiente por alguns minutos", "Furar todas as bolhas imediatamente", "Passar pomada antibiótica espessa"],
        answer: "B",
        explanation: "O resfriamento precoce com água corrente (não gelada) cessa a progressão do calor nos tecidos e reduz a dor imediata."
      },
      {
        id: 92,
        question: "A 'Regra dos Nove' de Wallace é um instrumento prático utilizado no APH para:",
        options: ["Calcular a dosagem de analgésicos", "Estimar a porcentagem de Superfície Corporal Queimada (SCQ) no paciente adulto", "Diagnosticar o grau de profundidade da lesão", "Determinar o tempo de internação na UTI"],
        answer: "B",
        explanation: "A Regra dos Nove divide o corpo adulto em seções equivalentes a 9% (ou múltiplos) para somar e estimar a extensão total da área queimada."
      },
      {
        id: 93,
        question: "Qual a porcentagem aproximada de SCQ atribuída à cabeça inteira de um adulto segundo a Regra dos Nove?",
        options: ["4,5%", "9%", "18%", "1%"],
        answer: "B",
        explanation: "A cabeça inteira (anterior + posterior) de um adulto corresponde a 9% da área total da superfície corporal."
      },
      {
        id: 94,
        question: "Uma queimadura que atinge a epiderme e derme profunda, caracterizada por dor intensa, eritema pronunciado e formação de bolhas (flictenas) é classificada como:",
        options: ["1º Grau", "2º Grau", "3º Grau", "4º Grau"],
        answer: "B",
        explanation: "As queimaduras de 2º grau afetam a epiderme e a derme, tendo como marca registrada as bolhas (flictenas) e a dor severa devido à exposição de terminações nervosas."
      },
      {
        id: 95,
        question: "Por que as queimaduras de 3º grau costumam ser indolores no seu centro?",
        options: ["Porque são lesões superficiais", "Porque destroem completamente todas as camadas da pele, incluindo os receptores sensoriais e terminações nervosas de dor", "Porque o paciente desmaia", "Devido à liberação maciça de endorfina local"],
        answer: "B",
        explanation: "Nas queimaduras de 3º grau, ocorre destruição total da espessura cutânea. Como as terminações nervosas nociceptivas são incineradas, não há sensibilidade dolorosa local."
      },
      {
        id: 96,
        question: "Qual o principal teste pré-hospitalar utilizado para identificar rapidamente sinais de Acidente Vascular Cerebral (AVC)?",
        options: ["Escala de Triagem de Cincinnati (Sorriso, Abraço, Música/Fala)", "Escala de Glasgow", "Exame de reflexo de Babinski", "Teste de glicose capilar isolado"],
        answer: "A",
        explanation: "A escala de Cincinnati avalia 3 sinais clássicos do AVC: desvio de rima labial (sorriso), fraqueza motora de um lado (abraço/elevação de braços) e alteração na fala (falar frase simples)."
      },
      {
        id: 97,
        question: "Durante um episódio de Crise Convulsiva, qual deve ser a principal conduta de segurança do socorrista?",
        options: ["Segurar a língua do paciente com uma colher ou dedos", "Proteger a cabeça do paciente com apoio macio, afastar objetos perigosos ao redor e posicionar o paciente em decúbito lateral após cessar as contrações", "Amarrar os braços e pernas da vítima para conter os movimentos", "Realizar respiração boca-a-boca contínua"],
        answer: "B",
        explanation: "A convulsão exige proteção passiva. Não se deve introduzir objetos na boca do paciente. Deve-se proteger a cabeça de impactos e lateralizar o corpo para evitar aspiração de saliva/vômito."
      },
      {
        id: 98,
        question: "Qual o sintoma clássico e mais comum que levanta suspeita de Infarto Agudo do Miocárdio (IAM) no adulto?",
        options: ["Dor de cabeça pulsante na nuca", "Dor ou desconforto retroesternal em aperto/opressão, que pode irradiar para braço esquerdo, mandíbula ou dorso", "Dor aguda ao respirar fundo", "Falta de ar passageira após espirros"],
        answer: "B",
        explanation: "A dor anginosa típica é descrita como um aperto, peso ou compressão no centro do peito, frequentemente irradiando para membro superior esquerdo e pescoço."
      },
      {
        id: 99,
        question: "Em caso de choque anafilático decorrente de picada de inseto ou alergia medicamentosa, qual medicamento é a primeira escolha que salva vidas?",
        options: ["Dipirona sódica intravenosa", "Adrenalina (Epinefrina) intramuscular", "Soro fisiológico gelado", "Xarope antialérgico"],
        answer: "B",
        explanation: "A adrenalina intramuscular (geralmente aplicada no vasto lateral da coxa) reverte a vasodilatação sistêmica extrema e o broncoespasmo severo da anafilaxia."
      },
      {
        id: 910,
        question: "Em emergências clínicas, o que significa a sigla D.O.V.A. no atendimento de suporte básico de vida?",
        options: ["Diagnóstico, Oxigênio, Ventilação e Ambulância", "Drenagem, Oclusão, Vias e Acesso", "Decisão de Óbito e Verificação de Alertas", "Nenhuma das anteriores"],
        answer: "D",
        explanation: "Não existe essa sigla formal regulamentada nas diretrizes internacionais de suporte básico (normalmente usa-se SAMU ou SBV)."
      }
    ]
  },
  {
    id: 10,
    number: 10,
    title: "Triagem em Incidentes com Múltiplas Vítimas (START)",
    subtitle: "Aprenda a classificar dezenas de vítimas simultâneas usando as cores Vermelha, Amarela, Verde e Preta.",
    pdfUrl: "#",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoTitle: "Método START de Triagem com Charles Aquino",
    hasPdf: true,
    hasVideo: true,
    hasQuiz: true,
    questions: [
      {
        id: 101,
        question: "O que significa a sigla START no contexto de triagem em acidentes com múltiplas vítimas?",
        options: ["Simples Triagem e Rápido Tratamento (Simple Triage and Rapid Treatment)", "Socorristas Treinados para Atendimento de Resgate e Transporte", "Sistema de Transporte Aéreo para Resgate de Traumatizados", "Serviço de Triagem Ativa em Rotatórias de Trânsito"],
        answer: "A",
        explanation: "O método START (Simple Triage and Rapid Treatment) foi criado para permitir que um socorrista trie cada vítima em no máximo 60 segundos com base em parâmetros fisiológicos simples."
      },
      {
        id: 102,
        question: "Quais são as 4 cores padrão utilizadas no método START para classificar a prioridade de atendimento das vítimas?",
        options: ["Azul, Vermelho, Amarelo e Branco", "Vermelho (Imediata), Amarelo (Atrasada), Verde (Menor/Ligeira) e Preto (Óbito/Expectante)", "Verde, Rosa, Roxo e Preto", "Laranja, Cinza, Marrom e Dourado"],
        answer: "B",
        explanation: "As cores representam: Vermelho (alto risco de vida iminente), Amarelo (estável mas exige atenção), Verde (vítimas ambulatoriais leves) e Preto (mortos ou com lesões incompatíveis com a vida na triagem rápida)."
      },
      {
        id: 103,
        question: "No método START, qual a primeira instrução dada em voz alta na cena para identificar instantaneamente as vítimas VERDES?",
        options: ["Pedir para todos que conseguem andar se moverem para uma área segura designada", "Pedir para todos gritarem o nome", "Mandar todos deitarem no chão", "Chamar apenas quem estiver sangrando"],
        answer: "A",
        explanation: "O primeiro passo do START é evacuar os 'feridos que andam'. Qualquer vítima que consiga andar sob comando é automaticamente classificada como prioridade Verde (3)."
      },
      {
        id: 104,
        question: "Ao avaliar uma vítima que não está respirando na cena, qual a única intervenção rápida permitida pelo método START antes de classificá-la?",
        options: ["Iniciar RCP de alta qualidade com compressões", "Abrir a via aérea manualmente (Jaw Thrust ou Chin Lift) e reposicionar a cabeça uma vez", "Realizar intubação endotraqueal", "Aplicar o colar cervical e coxins"],
        answer: "B",
        explanation: "No START, se a vítima não respira, abre-se a via aérea uma vez. Se ela voltar a respirar, vira Vermelha. Se continuar sem respirar, é classificada como Preta."
      },
      {
        id: 105,
        question: "Uma vítima que apresenta frequência respiratória acima de 30 ciclos por minuto (taquipneia severa) é classificada na cor:",
        options: ["Verde", "Amarela", "Vermelha", "Preta"],
        answer: "C",
        explanation: "Frequência respiratória > 30 rpm é um sinal crítico de choque ou insuficiência respiratória grave, enquadrando a vítima imediatamente na cor Vermelha."
      },
      {
        id: 106,
        question: "Na avaliação do enchimento capilar no START, se o tempo for superior a 2 segundos ou se o pulso radial estiver ausente, a vítima é classificada como:",
        options: ["Amarela", "Vermelha", "Preta", "Verde"],
        answer: "B",
        explanation: "A perfusão lentificada (enchimento capilar > 2s) ou ausência de pulso radial indica choque circulatório, enquadrando a vítima na prioridade máxima Vermelha."
      },
      {
        id: 107,
        question: "Se a vítima respira (< 30 rpm) e tem boa perfusão (pulso radial presente), qual o último parâmetro avaliado no START?",
        options: ["A temperatura da pele", "O nível de dor nas costas", "O status mental (capacidade de responder a comandos simples)", "A movimentação ativa de todas as articulações"],
        answer: "C",
        explanation: "Avalia-se a resposta neurológica básica. Se ela segue ordens simples ('abra a boca', 'aperte minha mão'), é Amarela. Se não obedece ou está confusa, é Vermelha."
      },
      {
        id: 108,
        question: "Uma vítima que apresenta fratura exposta de tíbia, mas está consciente, orientada, respirando a 20 rpm, e com pulso radial forte e cheio é classificada como:",
        options: ["Vermelha", "Amarela", "Verde", "Preta"],
        answer: "B",
        explanation: "Embora a lesão seja impressionante (fratura exposta), os parâmetros fisiológicos (respiração, perfusão e consciência) estão estáveis. Portanto, ela é Amarela."
      },
      {
        id: 109,
        question: "Qual a atitude correta em relação à realização de curativos e cuidados prolongados durante a aplicação da triagem START pelo socorrista triador?",
        options: ["Fazer curativos complexos em cada vítima antes de passar para a próxima", "Não realizar tratamentos prolongados; fazer apenas intervenções imediatas de segundos (como torniquetes para hemorragias graves e abertura de vias aéreas)", "Levar cada vítima nas costas até a ambulância", "Parar a triagem para conversar com familiares"],
        answer: "B",
        explanation: "O triador não trata. Ele apenas sinaliza e realiza intervenções de sobrevida rápida (torniquete em sangramento exsanguinante e posicionamento de via aérea) e segue para a próxima vítima."
      },
      {
        id: 110,
        question: "Vítimas classificadas na cor PRETA no método START representam:",
        options: ["Pessoas com ferimentos leves", "Mortos ou aqueles com lesões tão graves que a morte é iminente mesmo sob tratamento avançado, considerando a escassez de recursos na cena", "Pacientes que devem ser evacuados primeiro no helicóptero", "Polícia da cena"],
        answer: "B",
        explanation: "Em incidentes com múltiplas vítimas, a prioridade é salvar o maior número de vidas com os recursos disponíveis. Casos expectantes ou óbitos (Preto) recebem cuidados paliativos secundários após o atendimento dos Vermelhos e Amarelos."
      }
    ]
  }
];
