export const germinationStages = [
  {
    id: 1,
    title: "1. Absorção de Água (A Semente 'Bebe' Água)",
    duration: "Dia 1 - 2",
    imageUrl: "/germination-diagram.png",
    description: "A semente está seca e dormindo. Ao entrar em contato com a terra úmida ou algodão, ela absorve água e incha (aumenta de tamanho). Esse processo ativa o metabolismo interno que inicia a vida da nova plantinha.",
    tip: "Fique de olho: a semente inchada é o primeiro sinal de que a semente acordou!"
  },
  {
    id: 2,
    title: "2. Respiração (A Semente Começa a Respirar)",
    duration: "Dia 2 - 3",
    imageUrl: "/germination-diagram.png",
    description: "Agora cheia de água, a semente começa a respirar de forma intensa. Ela usa o oxigênio presente na terra para produzir energia rápida, preparando as células para crescerem.",
    tip: "A terra precisa estar fofinha para que a semente consiga respirar!"
  },
  {
    id: 3,
    title: "3. Multiplicação das Células (Crescimento Interno)",
    duration: "Dia 3",
    imageUrl: "/germination-diagram.png",
    description: "A energia acumulada é usada para criar novas células. Elas se dividem e multiplicam muito rápido embaixo da terra, formando o embrião da futura planta.",
    tip: "Evite mexer na terra agora para não machucar a plantinha que está se formando!"
  },
  {
    id: 4,
    title: "4. A Primeira Raiz (Radícula)",
    duration: "Dia 4",
    imageUrl: "/germination-diagram.png",
    description: "Veja no desenho e nas fotos reais: a radícula (que é a primeira raiz da planta) é uma pequena pontinha branca que rompe a casca da semente. Ela cresce para baixo, fixando a planta na terra e sugando água e minerais.",
    tip: "Identificação: A radícula (primeira raiz) é a primeira estrutura visível a sair da semente!"
  },
  {
    id: 5,
    title: "5. O Primeiro Stem / Broto (Caulículo)",
    duration: "Dia 5",
    imageUrl: "/germination-diagram.png",
    description: "O caulículo é o primeiro caule (broto) da planta. Ele cresce curvado (em forma de gancho ou alça) para proteger as folhinhas delicadas enquanto rasga a terra para subir.",
    tip: "Quando você vê um ganchinho verde saindo da terra, é o primeiro caule (caulículo) subindo!"
  },
  {
    id: 6,
    title: "6. Primeiras Folhinhas da Semente (Cotilédones)",
    duration: "Dia 6",
    imageUrl: "/germination-diagram.png",
    description: "Ao alcançar a luz, o gancho se estica e as duas primeiras folhas gordinhas se abrem: são os cotilédones (folhas temporárias com reservas de comida). Elas ficam verdes e fazem a primeira fotossíntese.",
    tip: "Os cotilédones (folhas da semente) são arredondados e gordinhos, diferentes das folhas comuns."
  },
  {
    id: 7,
    title: "7. Planta Bebê com Folhas Definitivas (Plântula)",
    duration: "Dia 7+",
    imageUrl: "/germination-diagram.png",
    description: "A semente virou uma plântula (planta bebê completa). Surgem as 'folhas verdadeiras' (folhas definitivas) com formato serrilhado. Os cotilédones murcham e caem, pois a planta agora produz seu próprio alimento.",
    tip: "Nesta fase, a planta bebê já usa a luz do sol para produzir toda a sua energia sozinha!"
  }
];

export const photosynthesisPhases = [
  {
    id: "clara",
    title: "Fase Clara (Fase da Luz)",
    subtitle: "Capturando a Luz do Sol com a Clorofila",
    imageUrl: "/photosynthesis-clara.png",
    location: "Ocorre nos Tilacoides (bolsinhas verdes de clorofila que parecem moedas empilhadas dentro da folha)",
    description: "Nesta etapa, a luz do sol é capturada pela clorofila (que funciona como painéis solares verdes na folha). A energia solar quebra as moléculas de água (H₂O) que a planta sugou do solo. Isso gera duas coisas importantes:",
    bullets: [
      "Liberação de Oxigênio (O₂): A quebra da água libera o oxigênio puro que nós respiramos no ar!",
      "Carregamento de Baterias Químicas: A planta guarda a energia da luz em pequenas baterias químicas temporárias (chamadas ATP e NADPH) para usar na próxima etapa."
    ],
    summary: "Resumo da Luz: Luz do Sol + Água ➔ Oxigênio para Respirar + Baterias Carregadas"
  },
  {
    id: "escura",
    title: "Fase Escura (Fábrica de Alimento - Ciclo de Calvin)",
    subtitle: "Capturando Gás Carbônico através das Portinhas da Folha (Estômatos)",
    imageUrls: ["/photosynthesis-escura-1.png", "/photosynthesis-escura-2.png"],
    location: "Ocorre no Estroma (líquido gelatinoso que preenche o interior da folha onde ficam os tilacoides)",
    description: "Nesta fase, a planta usa a energia que guardou na fase anterior para fabricar a glicose (um tipo de açúcar que serve de alimento). Ela absorve Gás Carbônico (CO₂) do ar através de portinhas microscópicas chamadas ESTÔMATOS (que abrem e fecham como boquinhas na folha):",
    bullets: [
      "Portinhas da Folha (Estômatos): Eles se abrem para capturar o gás carbônico e liberar vapor de água (transpiração).",
      "Montagem do Alimento (Ciclo de Calvin): Usando a energia das baterias químicas, a planta une o carbono do ar com os hidrogênios da água para construir moléculas de Glicose.",
      "Glicose (Alimento da Planta): Esse açúcar viaja por toda a planta, dando energia para ela crescer forte."
    ],
    summary: "Resumo do Alimento: Gás Carbônico + Energia das Baterias ➔ Glicose (Comida da Planta)"
  }
];

export const compostingInfo = {
  imageUrl: "/composting-diagram.png",
  description: "A compostagem é como a reciclagem mágica da natureza! É o processo biológico onde microrganismos (bactérias e fungos) e pequenos animais (como minhocas) transformam restos de comida e folhas secas em um adubo orgânico super rico chamado húmus.",
  benefits: [
    "Reduz o lixo orgânico que vai para os aterros sanitários (evitando a liberação de gases poluentes).",
    "Nutre o solo com vitaminas e minerais naturais, dispensando fertilizantes químicos.",
    "Melhora a textura da terra, ajudando a segurar a água e mantendo as plantas hidratadas por mais tempo."
  ],
  curiosities: [
    "A Composteira Ferve! Em pilhas de compostagem grandes e bem ativas, as bactérias trabalham tanto que a temperatura interna pode chegar a 60°C! Isso elimina germes e sementes indesejadas.",
    "Trabalho em Equipe: Além de bactérias e fungos, ácaros benéficos, colêmbolos e minhocas trabalham juntos como uma mini-equipe de demolição orgânica.",
    "Cheiro de Floresta: Um composto saudável e bem oxigenado tem um cheiro delicioso de terra úmida de floresta, nunca de podre!"
  ],
  steps: [
    {
      step: 1,
      title: "Prepare o Recipiente",
      desc: "Use uma caixa de madeira no quintal ou um sistema de 3 baldes plásticos empilhados (com furinhos no fundo para circulação de ar e escape do biofertilizante líquido)."
    },
    {
      step: 2,
      title: "Base de Carbono (Matéria Seca)",
      desc: "Forre o fundo com galhos finos, folhas secas, serragem ou pedaços de papelão sem tinta. Isso permite que o ar circule por baixo e evita que o composto fique compactado."
    },
    {
      step: 3,
      title: "Adicione Nitrogênio (Matéria Úmida)",
      desc: "Coloque os restos de comida: cascas de frutas, verduras, borra de café e cascas de ovos. Eles contêm nitrogênio, que alimenta as bactérias."
    },
    {
      step: 4,
      title: "Cobra Sempre (Regra de Ouro)",
      desc: "Cada vez que colocar restos úmidos, cubra-os completamente com uma camada de matéria seca (folhas ou serragem). Isso mantém a umidade sob controle e evita moscas e odores."
    },
    {
      step: 5,
      title: "Revire e Regue",
      desc: "O composto precisa de ar e umidade! Revire a mistura uma vez por semana. Se estiver seco, borrife um pouco de água. O ponto ideal é ter a umidade de uma esponja espremida."
    }
  ],
  podeIr: [
    "Cascas e restos de frutas, verduras e legumes",
    "Borra de café e filtros de papel",
    "Cascas de ovos (de preferência lavadas e trituradas)",
    "Sacos de chá de papel (sem o grampo e etiqueta)",
    "Folhas secas, serragem, palha e pequenos galhos",
    "Papelão picado e papel toalha sem tinta ou gordura"
  ],
  naoPodeIr: [
    "Restos de carne, peixe, ossos ou gordura animal (atraem roedores e causam mau cheiro)",
    "Laticínios como queijo, manteiga, iogurte e leite",
    "Alimentos temperados com muito sal, alho ou cebola (afastam as minhocas)",
    "Fezes de cães e gatos (podem transmitir doenças)",
    "Papéis plastificados, coloridos ou com tinta química",
    "Plantas com pragas ou doentes, e folhas de eucalipto (inibem o crescimento)"
  ]
};

export const initialPlants = [];
export const initialPosts = [];
export const initialUsers = [];

export const quizQuestions = [
  {
    id: 1,
    question: "Qual é a primeira estrutura visível a emergir da semente durante a germinação?",
    options: [
      "Cotilédones (as primeiras folhas da semente)",
      "Folhas verdadeiras (folhas definitivas)",
      "Radícula (a primeira raiz)",
      "Caulículo (o primeiro caule / broto)"
    ],
    answerIndex: 2,
    explanation: "A radícula é a primeira raiz. Ela cresce primeiro para prender a plantinha no solo e buscar água para mantê-la viva!"
  },
  {
    id: 2,
    question: "Qual é o motivo do caulículo (primeiro caule) crescer curvado em forma de 'gancho' embaixo da terra?",
    options: [
      "Para conseguir respirar melhor",
      "Para proteger as primeiras folhas delicadas do atrito com a terra",
      "Porque as plantas não conseguem crescer retas no escuro",
      "Para absorver melhor os nutrientes e os sais minerais"
    ],
    answerIndex: 1,
    explanation: "O caulículo (primeiro caule) se curva em forma de alça para empurrar o solo sem machucar a pontinha de crescimento das folhas novas."
  },
  {
    id: 3,
    question: "Onde ocorre a Fase Clara (de Luz) da fotossíntese e qual o seu principal subproduto liberado no ar?",
    options: [
      "Ocorre no Estroma (líquido interno) e libera Glicose (açúcar)",
      "Ocorre nos Tilacoides (bolsinhas de clorofila) e libera Glicose (açúcar)",
      "Ocorre no Estroma (líquido interno) e libera Oxigênio (O₂)",
      "Ocorre nos Tilacoides (bolsinhas de clorofila) e libera Oxigênio (O₂)"
    ],
    answerIndex: 3,
    explanation: "A Fase Clara ocorre nas bolsinhas de clorofila (Tilacoides). A energia do sol quebra a água, liberando o Oxigênio que nós respiramos."
  },
  {
    id: 4,
    question: "Quais são as 'portinhas' microscópicas nas folhas que se abrem para capturar o Gás Carbônico (CO₂)?",
    options: [
      "Estômatos (poros de respiração)",
      "Cloroplastos (painéis solares)",
      "Enzimas (ajudantes químicos)",
      "Parênquimas (tecidos da folha)"
    ],
    answerIndex: 0,
    explanation: "Os estômatos são pequenos poros na superfície da folha que controlam a entrada de CO₂ e a saída de vapor de água."
  },
  {
    id: 5,
    question: "Para uma compostagem saudável, qual dessas opções contém resíduos que NÃO devem ser adicionados?",
    options: [
      "Borra de café e cascas de banana",
      "Restos de queijo, carnes de churrasco e óleos",
      "Folhas secas e serragem de madeira",
      "Casca de ovos limpos e picados"
    ],
    answerIndex: 1,
    explanation: "Carnes, queijos e óleos causam mau cheiro forte, atraem insetos e ratos, e prejudicam os microrganismos da composteira."
  },
  {
    id: 6,
    question: "Qual é a função dos cotilédones (folhas da semente) logo após a germinação?",
    options: [
      "Fazer a primeira fotossíntese e fornecer energia de reserva guardada na semente",
      "Proteger a raiz do sol forte durante os primeiros dias",
      "Absorver água diretamente do solo junto com as raízes",
      "Produzir flores e sementes para a próxima geração"
    ],
    answerIndex: 0,
    explanation: "Os cotilédones têm duas funções: usar as reservas de nutrientes guardadas na semente e capturar a luz para fazer a primeira fotossíntese. Depois disso, eles caem!"
  },
  {
    id: 7,
    question: "O que é a Glicose produzida na Fase Escura (Ciclo de Calvin) da fotossíntese?",
    options: [
      "Um gás que as plantas liberam à noite para respirar",
      "Um tipo de açúcar que serve de alimento e energia para a planta crescer",
      "O pigmento verde que dá cor às folhas",
      "Uma substância que a planta absorve pelas raízes da chuva"
    ],
    answerIndex: 1,
    explanation: "A Glicose é um açúcar simples fabricado pela planta usando CO₂ do ar e energia solar. É o 'combustível' que move todas as atividades vitais da planta!"
  },
  {
    id: 8,
    question: "Qual é a 'Regra de Ouro' da compostagem para evitar moscas e mau cheiro?",
    options: [
      "Jogar água por cima sempre que adicionar restos de comida",
      "Misturar tudo junto sem separar materiais secos e úmidos",
      "Sempre cobrir os restos úmidos com uma camada de matéria seca (folhas ou serragem)",
      "Adicionar sal grosso para matar as bactérias ruins"
    ],
    answerIndex: 2,
    explanation: "Sempre que você jogar restos de comida (matéria úmida/nitrogenada), cubra com folhas secas, serragem ou papelão (matéria seca/carbonada). Isso cria o equilíbrio perfeito e evita moscas!"
  },
  {
    id: 9,
    question: "Por que é importante regar as plantas regularmente durante o cultivo?",
    options: [
      "Porque a água deixa as folhas verdes e bonitas para a foto",
      "Porque a água é necessária para a fotossíntese, transporte de nutrientes e manutenção das células",
      "Porque sem água as raízes ficam quentes demais e morrem de calor",
      "Porque a água cria fungos benéficos que alimentam a planta"
    ],
    answerIndex: 1,
    explanation: "A água é essencial para a vida da planta: participa da fotossíntese (Fase Clara), transporta sais minerais pelas raízes, mantém as células túrgidas (firmes) e regula a temperatura das folhas."
  },
  {
    id: 10,
    question: "O que acontece com os cotilédones (folhas da semente) quando as primeiras folhas verdadeiras aparecem?",
    options: [
      "Eles ficam maiores e mais verdes para ajudar na fotossíntese",
      "Eles se transformam nas folhas definitivas da planta adulta",
      "Eles murcham e caem, pois a planta já consegue produzir seu próprio alimento",
      "Eles se fecham à noite para proteger a planta do frio"
    ],
    answerIndex: 2,
    explanation: "Com as folhas verdadeiras crescidas e funcionando, a planta não precisa mais das reservas dos cotilédones. Eles cumpriram sua missão e naturalmente murcham e caem — é um sinal de saúde!"
  },
  {
    id: 11,
    question: "Qual é o principal gás absorvido pelas plantas durante a Fase Escura da fotossíntese?",
    options: [
      "Oxigênio (O₂)",
      "Gás Carbônico (CO₂)",
      "Nitrogênio (N₂)",
      "Hidrogênio (H₂)"
    ],
    answerIndex: 1,
    explanation: "As plantas absorvem Gás Carbônico (CO₂) do ar através dos estômatos para fabricar glicose no Ciclo de Calvin."
  },
  {
    id: 12,
    question: "Qual destes materiais é considerado 'matéria seca' (rica em carbono) para a composteira?",
    options: [
      "Serragem e folhas secas",
      "Cascas de banana e restos de maçã",
      "Borra de café",
      "Cascas de ovos"
    ],
    answerIndex: 0,
    explanation: "Folhas secas, serragem, palha e papelão são ricos em carbono e servem para cobrir a matéria úmida (rica em nitrogênio)."
  },
  {
    id: 13,
    question: "Como se chama o pigmento verde nas folhas que capta a luz solar?",
    options: [
      "Caroteno",
      "Clorofila",
      "Xantofila",
      "Antocianina"
    ],
    answerIndex: 1,
    explanation: "A clorofila é o pigmento verde que absorve a luz solar nos cloroplastos para iniciar a Fase Clara da fotossíntese."
  },
  {
    id: 14,
    question: "Em qual fase da germinação a semente incha e ativa seu metabolismo interno?",
    options: [
      "Fase de respiração",
      "Absorção de água (embebição)",
      "Crescimento da raiz",
      "Abertura dos cotilédones"
    ],
    answerIndex: 1,
    explanation: "Ao entrar em contato com a água, a semente seca a absorve e incha, iniciando o metabolismo para dar vida ao broto."
  },
  {
    id: 15,
    question: "O que é o biofertilizante líquido (ou chorume orgânico) na compostagem?",
    options: [
      "Um líquido tóxico que estraga o solo",
      "Um adubo líquido super rico em nutrientes obtido pelo excesso de umidade controlado",
      "Água pura da chuva que escorre",
      "Um veneno natural contra pragas do solo"
    ],
    answerIndex: 1,
    explanation: "O líquido escuro produzido na compostagem é um excelente biofertilizante orgânico, rico em nutrientes, e deve ser diluído em água para regar as plantas!"
  },
  {
    id: 16,
    question: "Qual o principal papel dos estômatos presentes nas folhas das plantas?",
    options: [
      "Absorver água e sais minerais do solo",
      "Realizar a troca gasosa (capturar CO₂ e liberar oxigênio e vapor de água)",
      "Proteger a folha contra insetos predadores",
      "Conduzir a seiva elaborada para as raízes"
    ],
    answerIndex: 1,
    explanation: "Os estômatos abrem e fecham para permitir a entrada de gás carbônico necessário para a fotossíntese e a saída de oxigênio e água por transpiração."
  },
  {
    id: 17,
    question: "O que ocorre durante o Ciclo de Calvin (Fase Escura) da fotossíntese?",
    options: [
      "A luz solar quebra a molécula de água em oxigênio e hidrogênio",
      "A planta captura oxigênio para queimar glicose",
      "O carbono do CO₂ é fixado utilizando energia para produzir glicose",
      "A clorofila é destruída pelo excesso de calor"
    ],
    answerIndex: 2,
    explanation: "No Ciclo de Calvin, o gás carbônico do ar é convertido em açúcar (glicose) usando as baterias químicas (ATP e NADPH) carregadas na fase clara."
  },
  {
    id: 18,
    question: "Por que não se deve colocar comida muito temperada ou salgada na composteira?",
    options: [
      "Porque o sal atrai baratas e formigas gigantes",
      "Porque o sal desidrata e mata os microrganismos e minhocas essenciais para a compostagem",
      "Porque o tempero deixa o adubo com cheiro ruim",
      "Porque o sal dissolve a matéria seca impedindo a aeração"
    ],
    answerIndex: 1,
    explanation: "O sal e temperos fortes alteram o pH do meio e desidratam por osmose as minhocas e os microrganismos decompositores, interrompendo o ciclo ecológico."
  },
  {
    id: 19,
    question: "O que acontece se a pilha de compostagem ficar seca demais (sem umidade)?",
    options: [
      "O composto fica pronto muito mais rápido",
      "Os microrganismos entram em dormência ou morrem, parando a decomposição",
      "As minhocas se multiplicam mais rapidamente",
      "O composto começa a exalar gás metano tóxico"
    ],
    answerIndex: 1,
    explanation: "A umidade é vital. Sem água, as bactérias e fungos não conseguem viver e trabalhar, paralisando a decomposição dos restos orgânicos."
  },
  {
    id: 20,
    question: "Como as minhocas ajudam fisicamente na produção do composto orgânico?",
    options: [
      "Elas comem os insetos ruins que aparecem na pilha",
      "Elas cavam túneis que oxigenam o solo e quebram a matéria em pedaços menores através da digestão",
      "Elas aquecem a terra com seu movimento",
      "Elas produzem oxigênio puro embaixo da terra"
    ],
    answerIndex: 1,
    explanation: "Ao se moverem, as minhocas criam canais de ar (aeração) e digerem a matéria orgânica, excretando o húmus que é um adubo extremamente rico."
  },
  {
    id: 21,
    question: "O que define um organismo autótrofo, como as plantas?",
    options: [
      "Um ser que se alimenta exclusivamente de outros vegetais",
      "Um organismo capaz de produzir seu próprio alimento a partir de substâncias inorgânicas usando energia (ex: luz)",
      "Um decompositor de matéria orgânica morta",
      "Um animal que realiza fotossíntese de forma artificial"
    ],
    answerIndex: 1,
    explanation: "Autótrofos são seres que 'se alimentam sozinhos' (do grego auto = próprio, trofo = alimento). As plantas produzem sua própria glicose via fotossíntese."
  },
  {
    id: 22,
    question: "Durante a Fase Clara da fotossíntese, qual a função da molécula de água (H₂O)?",
    options: [
      "Ela dissolve o açúcar produzido pela planta",
      "Ela é quebrada pela energia da luz para fornecer elétrons e liberar oxigênio (O₂)",
      "Ela serve apenas para resfriar a folha sob o sol",
      "Ela reage com a glicose para gerar clorofila"
    ],
    answerIndex: 1,
    explanation: "A fotólise da água é a quebra da molécula de água pela luz. Isso libera o oxigênio para a atmosfera e fornece hidrogênio e elétrons para carregar as baterias celulares."
  },
  {
    id: 23,
    question: "O que é uma plântula no ciclo de vida de um vegetal?",
    options: [
      "A semente que ainda não absorveu água",
      "O estágio jovem da planta após a germinação, quando ela já possui raiz, caule e folhas iniciais",
      "Uma planta adulta que parou de crescer",
      "O fruto logo após a polinização da flor"
    ],
    answerIndex: 1,
    explanation: "A plântula é o embrião germinado que já se desenvolveu em uma planta jovem visível, mas ainda pequena e em pleno crescimento."
  },
  {
    id: 24,
    question: "Qual o principal risco de regar uma planta em excesso, deixando a terra sempre encharcada?",
    options: [
      "A planta vai crescer rápido demais e quebrar o caule",
      "As raízes ficam sem oxigênio para respirar e apodrecem devido à proliferação de fungos ruins",
      "A planta absorve muito sal e fica salgada",
      "A fotossíntese é acelerada além do limite aceitável"
    ],
    answerIndex: 1,
    explanation: "O excesso de água expulsa o ar dos poros do solo. Sem oxigênio, as células das raízes morrem sufocadas e a planta apodrece de baixo para cima."
  },
  {
    id: 25,
    question: "Por que as folhas das plantas são majoritariamente verdes?",
    options: [
      "Porque elas absorvem a luz verde do sol e refletem as outras cores",
      "Porque contêm clorofila, um pigmento que absorve luz azul e vermelha e reflete a luz verde",
      "Porque o solo fornece nutrientes verdes para o caule",
      "Porque a glicose produzida tem coloração verde-escura"
    ],
    answerIndex: 1,
    explanation: "A clorofila absorve eficientemente as frequências de luz azul e vermelha para gerar energia, mas não absorve a luz verde, refletindo-a de volta para os nossos olhos."
  },
  {
    id: 26,
    question: "O que é o endosperma ou cotilédone antes da planta conseguir fazer fotossíntese?",
    options: [
      "A casca dura que protege a semente",
      "O tecido de reserva que fornece nutrientes para o embrião crescer durante a germinação",
      "A primeira folha que cai assim que a semente toca a terra",
      "O hormônio que faz a raiz crescer para baixo"
    ],
    answerIndex: 1,
    explanation: "Antes de sair da terra e abrir suas folhas verdes para fazer fotossíntese, o embrião se alimenta das reservas energéticas guardadas dentro da própria semente."
  },
  {
    id: 27,
    question: "O que é a matéria seca (rica em carbono) na compostagem?",
    options: [
      "Cascas de frutas e verduras frescas",
      "Folhas secas, serragem, palha, galhos secos e papelão sem tinta",
      "Esterco fresco de animais herbívoros",
      "Restos de borra de café úmida"
    ],
    answerIndex: 1,
    explanation: "A matéria castanha ou seca fornece o carbono necessário para a estrutura celular dos microrganismos e ajuda a aerar e equilibrar a umidade da composteira."
  },
  {
    id: 28,
    question: "Por que a compostagem é considerada um processo aeróbio?",
    options: [
      "Porque ela precisa de muita água corrente para funcionar",
      "Porque ocorre na presença de oxigênio, sendo conduzida por microrganismos que respiram ar",
      "Porque é feita embaixo da terra sem nenhum contato com o ar",
      "Porque libera gás metano em grandes quantidades"
    ],
    answerIndex: 1,
    explanation: "A compostagem saudável é feita com a presença de ar (oxigênio). Por isso mexemos a pilha periodicamente: para dar oxigênio às bactérias aeróbias trabalharem sem causar mau cheiro."
  },
  {
    id: 29,
    question: "De onde as plantas obtêm o gás carbônico (CO₂) necessário para a fotossíntese?",
    options: [
      "Diretamente da água que absorvem pelas raízes",
      "Do ar atmosférico, através dos estômatos nas folhas",
      "Dos minerais presentes no solo orgânico",
      "Da decomposição química da própria clorofila"
    ],
    answerIndex: 1,
    explanation: "O CO₂ está presente no ar que nos cerca. As plantas o capturam através de poros microscópicos chamados estômatos nas folhas."
  },
  {
    id: 30,
    question: "Qual a função principal da raiz de uma planta adulta?",
    options: [
      "Realizar a fotossíntese no escuro",
      "Fixar a planta no solo e absorver água e nutrientes minerais",
      "Produzir sementes e pólen para reprodução",
      "Proteger o caule de ventos muito frios"
    ],
    answerIndex: 1,
    explanation: "A raiz ancora a planta firmemente no solo e possui pelos absorventes que capturam a água e os sais minerais indispensáveis para a produção de seiva."
  },
  {
    id: 31,
    question: "O que acontece com a temperatura de uma composteira bem cuidada nas primeiras semanas?",
    options: [
      "Ela cai abaixo de zero devido ao vento",
      "Ela sobe bastante (podendo passar de 50°C) devido ao calor gerado pela atividade intensa das bactérias",
      "Ela se mantém exatamente igual à temperatura ambiente externa",
      "Ela flutua apenas de acordo com a umidade da chuva"
    ],
    answerIndex: 1,
    explanation: "A atividade metabólica dos microrganismos decompondo a matéria orgânica gera calor, elevando a temperatura da pilha, o que é ótimo para eliminar sementes de ervas daninhas e germes."
  },
  {
    id: 32,
    question: "Qual o principal açúcar gerado na fotossíntese que serve de alimento para a planta?",
    options: [
      "Frutose",
      "Glicose",
      "Lactose",
      "Sacarose artificial"
    ],
    answerIndex: 1,
    explanation: "A glicose é o carboidrato (açúcar simples) sintetizado durante a fotossíntese. É a fonte primária de energia para a respiração e crescimento da planta."
  },
  {
    id: 33,
    question: "Na compostagem, o que representa a matéria verde ou úmida?",
    options: [
      "Galhos grossos de árvore e pedras do jardim",
      "Restos de cozinha (cascas de legumes, frutas, saquinhos de chá) que são ricos em nitrogênio",
      "Plásticos biodegradáveis picados",
      "Papelão e jornais velhos rasgados"
    ],
    answerIndex: 1,
    explanation: "A matéria verde (úmida) é rica em nitrogênio. Ela serve de alimento proteico para as bactérias se multiplicarem e decomporem os materiais rapidamente."
  },
  {
    id: 34,
    question: "Por que a luz solar é indispensável para a fotossíntese?",
    options: [
      "Porque ela aquece a planta para derreter a água congelada",
      "Porque fornece a energia necessária para quebrar a água e unir os átomos na fabricação da glicose",
      "Porque clareia a folha permitindo que ela respire melhor",
      "Porque afasta insetos noturnos que comem a clorofila"
    ],
    answerIndex: 1,
    explanation: "A luz solar carrega a energia radiante. A clorofila absorve essa luz e a transforma em energia química, que atua como combustível para sintetizar açúcar a partir de água e CO₂."
  },
  {
    id: 35,
    question: "Qual o nome do processo pelo qual as plantas liberam vapor de água para a atmosfera, ajudando a regular sua temperatura?",
    options: [
      "Sublimação",
      "Transpiração",
      "Condensação",
      "Embebição celular"
    ],
    answerIndex: 1,
    explanation: "A transpiração ocorre quando a água evapora das folhas através dos estômatos, puxando mais água do solo e resfriando a planta no calor."
  },
  {
    id: 36,
    question: "Como se chama a casca protetora externa de uma semente?",
    options: [
      "Embrião",
      "Tegumento",
      "Endosperma",
      "Radícula"
    ],
    answerIndex: 1,
    explanation: "O tegumento é a casca ou envoltório protetor que mantém o embrião da semente seguro e adormecido até que as condições de germinação sejam ideais."
  },
  {
    id: 37,
    question: "O que é a clorofila?",
    options: [
      "Um nutriente mineral que as plantas sugam do solo",
      "Um pigmento fotorreceptor que capta a energia da luz solar para realizar a fotossíntese",
      "O açúcar que a planta usa para crescer",
      "A casca fina que protege o broto verde"
    ],
    answerIndex: 1,
    explanation: "A clorofila é uma molécula complexa (pigmento verde) localizada dentro dos cloroplastos que absorve a luz solar, dando início ao processo fotossintético."
  },
  {
    id: 38,
    question: "Na fotossíntese, qual gás é liberado no ar como subproduto da quebra da água?",
    options: [
      "Nitrogênio (N₂)",
      "Oxigênio (O₂)",
      "Gás Carbônico (CO₂)",
      "Metano (CH₄)"
    ],
    answerIndex: 1,
    explanation: "Quando a planta quebra a molécula de água na fase clara, ela aproveita os hidrogênios e descarta o Oxigênio residual no ar, purificando nossa atmosfera."
  },
  {
    id: 39,
    question: "Qual a função do caule para a estrutura de um vegetal?",
    options: [
      "Absorver água diretamente da chuva",
      "Sustentar as folhas e flores e transportar água e nutrientes entre a raiz e as folhas",
      "Enterrar a planta no solo durante o vento forte",
      "Produzir clorofila em larga escala no inverno"
    ],
    answerIndex: 1,
    explanation: "O caule atua como o esqueleto e o sistema de encanamento da planta, contendo vasos que levam água (xilema) e açúcar (floema) por todo o vegetal."
  },
  {
    id: 40,
    question: "O que é o húmus obtido ao final de uma compostagem de sucesso?",
    options: [
      "Um tipo de fungo venenoso que ataca plantas adultas",
      "Uma matéria orgânica escura, rica em nutrientes e microrganismos benéficos, ideal para adubar o solo",
      "Um biofertilizante gasoso inflamável",
      "Uma terra ácida que deve ser descartada"
    ],
    answerIndex: 1,
    explanation: "O húmus é o produto final da decomposição. Ele tem cheiro de floresta, é escuro, retém água perfeitamente e alimenta as plantas com minerais de absorção lenta."
  }
];

