import { initialPlants, initialPosts, initialUsers } from './data/mockData';
import { supabase } from './supabaseClient';

const ADMIN_EMAILS = ['esterferreira1800@gmail.com', 'esterferreira18000@gmail.com'];

export function getTodayDateBR() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateBR(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function normalizeDbObject(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map(normalizeDbObject);
  }
  if (typeof obj !== 'object') return obj;

  const normalized = { ...obj };

  // Key mappings for database columns (lowercase to camelCase)
  const keyMap = {
    fotourl: 'fotoUrl',
    criadaem: 'criadaEm',
    turmaid: 'turmaId',
    isadmin: 'isAdmin',
    studentname: 'studentName',
    studentemail: 'studentEmail',
    startdate: 'startDate',
    lastpenaltydate: 'lastPenaltyDate',
    plantid: 'plantId',
    plantname: 'plantName',
    stagename: 'stageName'
  };

  for (const [lowerKey, camelKey] of Object.entries(keyMap)) {
    if (lowerKey in normalized) {
      normalized[camelKey] = normalized[lowerKey];
    }
  }

  // Enforce isAdmin = true and points = 0 for admin emails
  if (normalized.email && typeof normalized.email === 'string') {
    const cleanEmail = normalized.email.trim().toLowerCase();
    if (ADMIN_EMAILS.includes(cleanEmail)) {
      normalized.isAdmin = true;
      normalized.points = 0; // Administradores nunca acumulam pontos
    }
  }

  // Also normalize comments array in posts if it exists
  if (Array.isArray(normalized.comments)) {
    normalized.comments = normalized.comments.map(c => {
      if (c && typeof c === 'object') {
        const normalizedComment = { ...c };
        if ('studentemail' in normalizedComment) {
          normalizedComment.studentEmail = normalizedComment.studentemail;
        }
        if ('studentname' in normalizedComment) {
          normalizedComment.studentName = normalizedComment.studentname;
        }
        return normalizedComment;
      }
      return c;
    });
  }

  return normalized;
}


// Função para simular a análise de estágio por IA com base na espécie da planta e no dia de cultivo
export function analyzePlantStage(species, day) {
  const cleanSpecies = species.trim() || "Planta";
  const numDay = parseInt(day) || 1;

  if (numDay <= 3) {
    return {
      stageName: "Germinação - Absorção de Água",
      analysis: `A semente de ${cleanSpecies} está na fase inicial de absorver água. A casca protetora está amaciando para que a primeira raiz (radícula) possa sair nos próximos dias. Mantenha a terra ou algodão úmidos, mas sem encharcar!`
    };
  } else if (numDay <= 6) {
    return {
      stageName: "Germinação - Raiz e Caule",
      analysis: `O broto de ${cleanSpecies} está a caminho da superfície! A primeira raiz (radícula) já se fixou no solo para buscar água e o primeiro caule (caulículo) está crescendo para cima para alcançar a luz do sol. Evite mexer na terra para não machucar a plantinha delicada.`
    };
  } else if (numDay <= 10) {
    return {
      stageName: "Planta Bebê - Folhas Iniciais",
      analysis: `Que vitória! A ${cleanSpecies} saiu da terra e as primeiras folhas da semente (cotilédones) se abriram completamente. Elas captam a luz para começar a fazer a primeira fotossíntese. Deixe a plantinha em um local bem iluminado!`
    };
  } else if (numDay <= 18) {
    return {
      stageName: "Crescimento - Folhas Definitivas",
      analysis: `Muito bem! As folhas da semente cumpriram seu papel e agora a ${cleanSpecies} desenvolveu as primeiras folhas verdadeiras (folhas definitivas da planta). O caule está se fortalecendo e ela está produzindo sua própria energia (glicose). Regue sempre que a terra secar por cima.`
    };
  } else if (numDay <= 25) {
    return {
      stageName: "Crescimento do Ramo e Raízes",
      analysis: `Excelente evolução! A sua ${cleanSpecies} está criando novos galhos e mais folhas. As raízes estão se espalhando no vaso para sugar mais nutrientes do solo. Adicione um pouco de adubo orgânico para dar mais energia!`
    };
  } else {
    return {
      stageName: "Planta Jovem Forte",
      analysis: `Parabéns! A ${cleanSpecies} já é uma planta jovem independente e forte. Ela tem várias folhas adultas fazendo fotossíntese (fase clara de luz e fase escura de produção de alimento) para fabricar sua energia. Continue cuidando com regas regulares e sol direto.`
    };
  }
}

// Limpar dados locais de um usuário específico (quando deletado do Supabase)
export function clearLocalUserData(email) {
  if (!email) return;
  const cleanEmail = email.trim().toLowerCase();

  // 1. Remover da lista de usuários
  let users = JSON.parse(localStorage.getItem('cultiva_users') || '[]');
  users = users.filter(u => (u.email || '').trim().toLowerCase() !== cleanEmail);
  localStorage.setItem('cultiva_users', JSON.stringify(users));

  // 2. Remover plantas
  let plants = JSON.parse(localStorage.getItem('cultiva_plants') || '[]');
  plants = plants.filter(p => (p.studentEmail || '').trim().toLowerCase() !== cleanEmail);
  localStorage.setItem('cultiva_plants', JSON.stringify(plants));

  // 3. Remover posts
  let posts = JSON.parse(localStorage.getItem('cultiva_posts') || '[]');
  posts = posts.filter(p => (p.studentEmail || '').trim().toLowerCase() !== cleanEmail);
  localStorage.setItem('cultiva_posts', JSON.stringify(posts));

  // 4. Remover feedbacks
  let feedbacks = JSON.parse(localStorage.getItem('cultiva_feedback') || '[]');
  feedbacks = feedbacks.filter(f => (f.email || '').trim().toLowerCase() !== cleanEmail);
  localStorage.setItem('cultiva_feedback', JSON.stringify(feedbacks));

  // 5. Remover sessão se for o próprio usuário logado
  const session = localStorage.getItem('cultiva_user');
  if (session) {
    const parsed = JSON.parse(session);
    if ((parsed.email || '').trim().toLowerCase() === cleanEmail) {
      localStorage.removeItem('cultiva_user');
    }
  }
}

// Função auxiliar para sincronizar dados criados/atualizados offline para o Supabase
export async function syncLocalToSupabase() {
  if (!supabase) return;
  console.log('[Cultiva Sync] Verificando dados offline para sincronizar com Supabase...');

  try {
    const loggedInUserStr = localStorage.getItem('cultiva_user');
    if (!loggedInUserStr) {
      console.log('[Cultiva Sync] Nenhum usuário logado. Sincronização offline ignorada.');
      return;
    }
    
    const localUser = normalizeDbObject(JSON.parse(loggedInUserStr));
    const cleanEmail = localUser.email?.trim().toLowerCase();
    if (!cleanEmail) return;

    // 1. Sincronizar apenas o próprio usuário logado
    const { data: serverUser, error: errUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!errUser) {
      if (!serverUser) {
        // Se o usuário logado não existe no Supabase, significa que foi excluído pelo administrador.
        // Devemos limpar os dados locais e deslogar.
        console.log(`[Cultiva Sync] Usuário ${cleanEmail} não existe no Supabase. Limpando dados locais.`);
        clearLocalUserData(cleanEmail);
        return; // interrompe a sincronização
      } else {
        const normalizedServerUser = normalizeDbObject(serverUser);
        if (
          localUser.points > normalizedServerUser.points ||
          localUser.password !== normalizedServerUser.password ||
          localUser.turmaId !== normalizedServerUser.turmaId
        ) {
          console.log(`[Cultiva Sync] Atualizando pontuação/senha/turma do usuário logado no Supabase: ${localUser.email}`);
          await supabase.from('users').update({
            points: Math.max(localUser.points, normalizedServerUser.points),
            password: localUser.password || normalizedServerUser.password,
            turmaId: localUser.turmaId || normalizedServerUser.turmaId
          }).eq('email', localUser.email);
        }
      }
    }

    // 2. Sincronizar turmas criadas offline (apenas se o usuário logado for ADM)
    if (localUser.isAdmin) {
      const localTurmas = JSON.parse(localStorage.getItem('cultiva_turmas') || '[]');
      const { data: serverTurmas, error: errTurmas } = await supabase.from('turmas').select('*');
      if (!errTurmas && serverTurmas) {
        const normalizedServerTurmas = normalizeDbObject(serverTurmas);
        for (const localTurma of localTurmas) {
          const exists = normalizedServerTurmas.some(t => t.id === localTurma.id);
          if (!exists) {
            console.log(`[Cultiva Sync] Enviando turma offline para o Supabase: ${localTurma.nome}`);
            await supabase.from('turmas').insert([localTurma]);
          }
        }
      }
    }

    // 3. Sincronizar plantas e seu histórico de fotos da própria conta
    const localPlants = JSON.parse(localStorage.getItem('cultiva_plants') || '[]');
    const myLocalPlants = localPlants.filter(p => (p.studentEmail || '').trim().toLowerCase() === cleanEmail);
    const { data: serverPlants, error: errPlants } = await supabase
      .from('plants')
      .select('*')
      .eq('studentEmail', cleanEmail);

    if (!errPlants && serverPlants) {
      const normalizedServerPlants = normalizeDbObject(serverPlants);
      for (const localPlant of myLocalPlants) {
        const serverPlant = normalizedServerPlants.find(p => p.id === localPlant.id);
        if (!serverPlant) {
          console.log(`[Cultiva Sync] Enviando nova planta offline para o Supabase: ${localPlant.name}`);
          await supabase.from('plants').insert([localPlant]);
        } else if ((localPlant.photos || []).length > (serverPlant.photos || []).length) {
          console.log(`[Cultiva Sync] Atualizando fotos offline da planta: ${localPlant.name}`);
          await supabase.from('plants').update({ photos: localPlant.photos }).eq('id', localPlant.id);
        }
      }
    }

    // 4. Sincronizar posts do feed da própria conta
    const localPosts = JSON.parse(localStorage.getItem('cultiva_posts') || '[]');
    const myLocalPosts = localPosts.filter(p => (p.studentEmail || '').trim().toLowerCase() === cleanEmail);
    const { data: serverPosts, error: errPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('studentEmail', cleanEmail);

    if (!errPosts && serverPosts) {
      const normalizedServerPosts = normalizeDbObject(serverPosts);
      for (const localPost of myLocalPosts) {
        const exists = normalizedServerPosts.some(p => p.id === localPost.id);
        if (!exists) {
          console.log(`[Cultiva Sync] Enviando post do feed offline para o Supabase: ${localPost.id}`);
          await supabase.from('posts').insert([localPost]);
        }
      }
    }

    // 5. Sincronizar feedbacks de aula da própria conta
    const localFeedback = JSON.parse(localStorage.getItem('cultiva_feedback') || '[]');
    const myLocalFeedback = localFeedback.filter(f => (f.email || '').trim().toLowerCase() === cleanEmail);
    const { data: serverFeedback, error: errFeedback } = await supabase
      .from('feedback')
      .select('*')
      .eq('email', cleanEmail);

    if (!errFeedback && serverFeedback) {
      const normalizedServerFeedback = normalizeDbObject(serverFeedback);
      for (const localFb of myLocalFeedback) {
        const exists = normalizedServerFeedback.some(f => f.email === localFb.email);
        if (!exists) {
          console.log(`[Cultiva Sync] Enviando feedback offline para o Supabase: ${localFb.email}`);
          const emojiMap = { '😍': 4, '🙂': 3, '😐': 2, '😢': 1 };
          const dbVote = emojiMap[localFb.vote] || 4;
          const dbEntry = { ...localFb, vote: dbVote };
          await supabase.from('feedback').insert([dbEntry]);
        }
      }
    }

    // 6. Sincronizar atividades da própria conta
    const localActivities = JSON.parse(localStorage.getItem('cultiva_activities') || '[]');
    const myLocalActivities = localActivities.filter(a => (a.studentEmail || '').trim().toLowerCase() === cleanEmail);
    const { data: serverActivities, error: errActivities } = await supabase
      .from('activities')
      .select('*')
      .eq('studentEmail', cleanEmail);

    if (!errActivities && serverActivities) {
      const normalizedServerActivities = normalizeDbObject(serverActivities);
      for (const localAct of myLocalActivities) {
        const exists = normalizedServerActivities.some(a => a.id === localAct.id);
        if (!exists) {
          console.log(`[Cultiva Sync] Enviando atividade offline para o Supabase: ${localAct.id}`);
          await supabase.from('activities').insert([localAct]);
        }
      }
    }

    console.log('[Cultiva Sync] Sincronização offline-para-online concluída com sucesso!');
  } catch (err) {
    console.warn('[Cultiva Sync] Falha durante a sincronização automática:', err);
  }
}

// Inicializar banco de dados no LocalStorage se não existir
export async function initDb(forceSync = false) {
  // Remover dados de teste para evitar ressincronização indesejada
  if (forceSync) {
    const isTestUser = (email, name) => {
      const e = (email || '').toLowerCase().trim();
      const n = (name || '').toLowerCase().trim();
      return e.includes('test') || e.includes('teste') || n === 'test' || n === 'teste' || e === 'mateus9811sc3@gmail.com' || e === 'leveday.oficial@gmail.com';
    };

    let localUsers = JSON.parse(localStorage.getItem('cultiva_users') || '[]');
    const testUsers = localUsers.filter(u => isTestUser(u.email, u.name));
    if (testUsers.length > 0) {
      localUsers = localUsers.filter(u => !isTestUser(u.email, u.name));
      localStorage.setItem('cultiva_users', JSON.stringify(localUsers));
      console.log(`[Cultiva Cleanup] Removidos ${testUsers.length} usuários locais de teste.`);
      
      if (supabase) {
        Promise.all(testUsers.map(async (tu) => {
          console.log(`[Cultiva Cleanup] Removendo usuário de teste do Supabase: ${tu.email}`);
          await supabase.from('users').delete().eq('email', tu.email);
        })).catch(err => console.warn('[Cultiva Cleanup] Erro ao deletar no Supabase:', err));
      }
    }

    let localPlants = JSON.parse(localStorage.getItem('cultiva_plants') || '[]');
    if (localPlants.some(p => isTestUser(p.studentEmail, p.studentName))) {
      localPlants = localPlants.filter(p => !isTestUser(p.studentEmail, p.studentName));
      localStorage.setItem('cultiva_plants', JSON.stringify(localPlants));
    }

    let localPosts = JSON.parse(localStorage.getItem('cultiva_posts') || '[]');
    if (localPosts.some(p => isTestUser(p.studentEmail, p.studentName))) {
      localPosts = localPosts.filter(p => !isTestUser(p.studentEmail, p.studentName));
      localStorage.setItem('cultiva_posts', JSON.stringify(localPosts));
    }

    const session = localStorage.getItem('cultiva_user');
    if (session) {
      const parsed = JSON.parse(session);
      if (isTestUser(parsed.email, parsed.name)) {
        localStorage.removeItem('cultiva_user');
      }
    }
  }

  // Limpeza forçada única dos caches e usuários antigos locais para migração limpa para o Supabase
  if (localStorage.getItem('cultiva_cache_version') !== 'v2') {
    localStorage.removeItem('cultiva_plants');
    localStorage.removeItem('cultiva_posts');
    localStorage.removeItem('cultiva_users');
    localStorage.removeItem('cultiva_user');
    localStorage.removeItem('cultiva_feedback');
    localStorage.removeItem('cultiva_turmas');
    localStorage.setItem('cultiva_cache_version', 'v2');
  }

  if (!localStorage.getItem('cultiva_plants')) {
    localStorage.setItem('cultiva_plants', JSON.stringify(initialPlants));
  }
  if (!localStorage.getItem('cultiva_posts')) {
    localStorage.setItem('cultiva_posts', JSON.stringify(initialPosts));
  }
  if (!localStorage.getItem('cultiva_users')) {
    localStorage.setItem('cultiva_users', JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem('cultiva_feedback')) {
    localStorage.setItem('cultiva_feedback', JSON.stringify([]));
  }
  if (!localStorage.getItem('cultiva_turmas')) {
    localStorage.setItem('cultiva_turmas', JSON.stringify([]));
  }
  if (!localStorage.getItem('cultiva_activities')) {
    localStorage.setItem('cultiva_activities', JSON.stringify([]));
  }

  // Sincronização com o Supabase (se disponível e forçada no início do app)
  if (supabase && forceSync) {
    // Primeiro envia quaisquer alterações pendentes que foram salvas offline
    await syncLocalToSupabase();

    try {
      const [
        { data: turmas, error: errorTurmas },
        { data: users, error: errorUsers },
        { data: plants, error: errorPlants },
        { data: posts, error: errorPosts },
        { data: feedback, error: errorFeedback },
        { data: activities, error: errorActivities }
      ] = await Promise.all([
        supabase.from('turmas').select('*'),
        supabase.from('users').select('*'),
        supabase.from('plants').select('*'),
        supabase.from('posts').select('*'),
        supabase.from('feedback').select('*'),
        supabase.from('activities').select('*')
      ]);

      if (errorTurmas) console.warn('[Supabase Sync] Erro ao buscar turmas:', errorTurmas);
      else if (turmas) localStorage.setItem('cultiva_turmas', JSON.stringify(normalizeDbObject(turmas)));

      if (errorUsers) console.warn('[Supabase Sync] Erro ao buscar usuários:', errorUsers);
      else if (users) localStorage.setItem('cultiva_users', JSON.stringify(normalizeDbObject(users)));

      if (errorPlants) console.warn('[Supabase Sync] Erro ao buscar plantas:', errorPlants);
      else if (plants) {
        const normalizedPlants = normalizeDbObject(plants);
        const localPlants = JSON.parse(localStorage.getItem('cultiva_plants') || '[]');
        const unsyncedPlants = localPlants.filter(lp => !normalizedPlants.some(sp => sp.id === lp.id));
        localStorage.setItem('cultiva_plants', JSON.stringify([...normalizedPlants, ...unsyncedPlants]));
      }

      if (errorPosts) console.warn('[Supabase Sync] Erro ao buscar posts:', errorPosts);
      else if (posts) {
        const normalizedPosts = normalizeDbObject(posts);
        const localPosts = JSON.parse(localStorage.getItem('cultiva_posts') || '[]');
        const unsyncedPosts = localPosts.filter(lp => !normalizedPosts.some(sp => sp.id === lp.id));
        const sortedPosts = [...normalizedPosts, ...unsyncedPosts].sort((a, b) => b.id.localeCompare(a.id));
        localStorage.setItem('cultiva_posts', JSON.stringify(sortedPosts));
      }

      if (errorFeedback) console.warn('[Supabase Sync] Erro ao buscar feedback:', errorFeedback);
      else if (feedback) {
        const intMap = { 4: '😍', 3: '🙂', 2: '😐', 1: '😢' };
        const normalizedFeedback = normalizeDbObject(feedback);
        const mappedFeedback = normalizedFeedback.map(f => {
          const emojiVote = intMap[f.vote] || f.vote;
          return { ...f, vote: emojiVote };
        });
        localStorage.setItem('cultiva_feedback', JSON.stringify(mappedFeedback));
      }

      if (errorActivities) console.warn('[Supabase Sync] Erro ao buscar atividades:', errorActivities);
      else if (activities) {
        localStorage.setItem('cultiva_activities', JSON.stringify(normalizeDbObject(activities)));
      }

      console.log('%c[Cultiva] Dados sincronizados com o Supabase com sucesso!', 'color: #22c55e; font-weight: bold;');
    } catch (err) {
      console.warn('[Cultiva] Falha na sincronização inicial com o Supabase. Usando cache offline:', err);
    }
  }
}

// ====== SISTEMA DE TURMAS ======

// Sanitizar URLs de imagens para evitar que imagens corrompidas ou gigantes quebrem a exibição
export function sanitizeImageUrl(url) {
  if (!url) return null;
  // Se for uma imagem base64 gigante (maior que ~1MB ou 1.3M caracteres) ou corrompida
  if (typeof url === 'string' && url.startsWith('data:image/') && url.length > 1300000) {
    return "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=60";
  }
  return url;
}

// Obter todas as turmas
export function getTurmas() {
  initDb();
  const turmas = JSON.parse(localStorage.getItem('cultiva_turmas') || '[]');
  return turmas.map(t => ({
    ...t,
    fotoUrl: sanitizeImageUrl(t.fotoUrl)
  }));
}

// Salvar turmas
function saveTurmas(turmas) {
  localStorage.setItem('cultiva_turmas', JSON.stringify(turmas));
}

// Criar nova turma (ADM)
export function createTurma(nome, fotoUrl) {
  const turmas = getTurmas();
  const newTurma = {
    id: 'turma-' + Date.now(),
    nome: nome.trim(),
    fotoUrl: fotoUrl || null,
    criadaEm: getTodayDateBR()
  };
  turmas.push(newTurma);
  saveTurmas(turmas);

  if (supabase) {
    supabase.from('turmas').insert([newTurma]).then(({ error }) => {
      if (error) console.error('[Supabase Error] createTurma:', error);
    });
  }

  return newTurma;
}

// Excluir turma (ADM)
export function deleteTurma(turmaId) {
  const turmas = getTurmas().filter(t => t.id !== turmaId);
  saveTurmas(turmas);

  if (supabase) {
    supabase.from('turmas').delete().eq('id', turmaId).then(({ error }) => {
      if (error) console.error('[Supabase Error] deleteTurma:', error);
    });
  }

  return turmas;
}

// Atualizar foto de uma turma
export function updateTurmaFoto(turmaId, fotoUrl) {
  const turmas = getTurmas();
  const idx = turmas.findIndex(t => t.id === turmaId);
  if (idx === -1) return null;
  turmas[idx].fotoUrl = fotoUrl;
  saveTurmas(turmas);

  if (supabase) {
    supabase.from('turmas').update({ fotoUrl }).eq('id', turmaId).then(({ error }) => {
      if (error) console.error('[Supabase Error] updateTurmaFoto:', error);
    });
  }

  return turmas[idx];
}

// Obter todas as plantas do LocalStorage
export function getPlants() {
  initDb();
  const plants = JSON.parse(localStorage.getItem('cultiva_plants') || '[]');
  return normalizeDbObject(plants).map(plant => ({
    ...plant,
    photos: (plant.photos || []).map(photo => ({
      ...photo,
      url: sanitizeImageUrl(photo.url)
    }))
  }));
}

// Obter todos os posts do LocalStorage
export function getPosts() {
  initDb();
  const posts = JSON.parse(localStorage.getItem('cultiva_posts') || '[]');
  return normalizeDbObject(posts).map(post => ({
    ...post,
    url: sanitizeImageUrl(post.url)
  }));
}

// Obter todos os alunos e pontuações do LocalStorage
export function getUsers() {
  initDb();
  const users = JSON.parse(localStorage.getItem('cultiva_users') || '[]');
  return normalizeDbObject(users);
}

// Obter atividades do LocalStorage
export function getActivities() {
  initDb();
  return JSON.parse(localStorage.getItem('cultiva_activities') || '[]');
}

// Registrar atividade
export function logActivity(studentEmail, studentName, type, title, description, points, date) {
  const activities = getActivities();
  const newActivity = {
    id: 'act-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    studentEmail: studentEmail.trim().toLowerCase(),
    studentName,
    type,
    title,
    description,
    points,
    date
  };
  activities.push(newActivity);
  localStorage.setItem('cultiva_activities', JSON.stringify(activities));

  if (supabase) {
    supabase.from('activities').insert([newActivity]).then(({ error }) => {
      if (error) console.error('[Supabase Error] logActivity:', error);
    });
  }
}

// Salvar plantas no LocalStorage
function savePlants(plants) {
  localStorage.setItem('cultiva_plants', JSON.stringify(plants));
}

// Salvar posts no LocalStorage
function savePosts(posts) {
  localStorage.setItem('cultiva_posts', JSON.stringify(posts));
}

// Salvar usuários no LocalStorage
export function saveUsers(users) {
  localStorage.setItem('cultiva_users', JSON.stringify(users));
}

// Realizar Login
export async function loginUser(email, password) {
  initDb();
  const cleanEmail = email.trim().toLowerCase();
  const isAdmin = ADMIN_EMAILS.includes(cleanEmail);
  
  // 1. Verificar se é ADM
  if (isAdmin) {
    if (password === '130122') {
      const adminUser = { name: 'Ester Ferreira (ADM)', email: cleanEmail, isAdmin: true, points: 0 };
      if (supabase) {
        // Garantir que no banco ela esteja como admin e com 0 pontos
        supabase.from('users').update({ isAdmin: true, name: 'Ester Ferreira (ADM)', points: 0 }).eq('email', cleanEmail)
          .then(({ error }) => {
            if (error) console.error('[Supabase Admin Update] Erro ao atualizar status de admin:', error);
          });
      }
      return adminUser;
    } else {
      throw new Error('Senha incorreta do administrador.');
    }
  }

  // 2. Verificar no Supabase se estiver conectado
  if (supabase) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) {
        console.warn('[Supabase Login] Erro ao buscar usuário:', error);
      } else if (user) {
        const normalizedUser = normalizeDbObject(user);
        // Se o usuário já existe mas não tem senha cadastrada (migração), define a digitada
        if (!normalizedUser.password) {
          normalizedUser.password = password;
          // Atualiza no Supabase
          await supabase.from('users').update({ password }).eq('email', cleanEmail);
          
          // Atualiza localmente
          const users = getUsers();
          const localIdx = users.findIndex(u => u.email === cleanEmail);
          if (localIdx === -1) {
            users.push(normalizedUser);
          } else {
            users[localIdx] = normalizedUser;
          }
          saveUsers(users);
          return { ...normalizedUser, isAdmin: isAdmin };
        }

        if (normalizedUser.password === password) {
          // Atualiza dados locais
          const users = getUsers();
          const localIdx = users.findIndex(u => u.email === cleanEmail);
          if (localIdx === -1) {
            users.push(normalizedUser);
          } else {
            users[localIdx] = normalizedUser;
          }
          saveUsers(users);
          return { ...normalizedUser, isAdmin: isAdmin };
        } else {
          throw new Error('Senha incorreta.');
        }
      } else {
        throw new Error('Usuário não encontrado. Por favor, cadastre-se.');
      }
    } catch (err) {
      console.warn('[Supabase Login] Falha ou tentativa local:', err.message);
      if (err.message && (err.message.includes('Senha') || err.message.includes('encontrado'))) {
        throw err;
      }
    }
  }

  // 3. Fallback ou busca local
  const users = getUsers();
  const user = users.find(u => u.email === cleanEmail);

  if (!user) {
    throw new Error('Usuário não encontrado. Por favor, cadastre-se.');
  }

  // Se o usuário local não tem senha cadastrada (migração), define a digitada
  if (!user.password) {
    user.password = password;
    saveUsers(users);
    return { ...user, isAdmin: isAdmin };
  }

  if (user.password === password) {
    return { ...user, isAdmin: isAdmin };
  } else {
    throw new Error('Senha incorreta.');
  }
}

// Registrar novo Aluno
export async function registerStudent(name, email, password, turmaId) {
  initDb();
  const cleanEmail = email.trim().toLowerCase();
  
  if (ADMIN_EMAILS.includes(cleanEmail)) {
    throw new Error('Este e-mail é reservado para administração.');
  }

  // Verificar se usuário já existe localmente ou no Supabase
  const localUsers = getUsers();
  const existsLocal = localUsers.some(u => u.email === cleanEmail);
  if (existsLocal) {
    throw new Error('E-mail já cadastrado.');
  }

  if (supabase) {
    const { data: existing, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase Register] Erro de verificação:', error);
    } else if (existing) {
      throw new Error('E-mail já cadastrado no servidor.');
    }
  }

  const newUser = {
    email: cleanEmail,
    name: name.trim(),
    password: password,
    points: 0,
    turmaId: turmaId || null,
    isAdmin: false
  };

  // Salvar local
  localUsers.push(newUser);
  saveUsers(localUsers);

  // Salvar no Supabase
  if (supabase) {
    const { error: insertError } = await supabase
      .from('users')
      .insert([newUser]);
    
    if (insertError) {
      console.error('[Supabase Error] registerStudent:', insertError);
    }
  }

  return newUser;
}

// Associar alunos a uma turma (ADM)
export async function updateUsersTurma(turmaId, studentEmails) {
  const users = getUsers();
  
  // Atualizar localmente
  const updatedUsers = users.map(u => {
    if (studentEmails.includes(u.email)) {
      return { ...u, turmaId: turmaId };
    } else if (u.turmaId === turmaId) {
      // Se estava nesta turma mas foi removido
      return { ...u, turmaId: null };
    }
    return u;
  });
  saveUsers(updatedUsers);

  // Atualizar no Supabase
  if (supabase) {
    try {
      // Remover turma dos que não pertencem mais
      const emailsToRemove = users.filter(u => u.turmaId === turmaId && !studentEmails.includes(u.email)).map(u => u.email);
      if (emailsToRemove.length > 0) {
        await supabase.from('users').update({ turmaId: null }).in('email', emailsToRemove);
      }
      
      // Adicionar turma aos novos
      if (studentEmails.length > 0) {
        await supabase.from('users').update({ turmaId: turmaId }).in('email', studentEmails);
      }
    } catch (err) {
      console.error('[Supabase Error] updateUsersTurma:', err);
    }
  }
}

// Obter Ranking Leaderboard
export function getLeaderboard(currentUser) {
  const users = getUsers();
  
  // Filtrar usuários do ranking
  const filteredUsers = users.filter(u => {
    // 1. Nunca mostrar administradores no ranking
    if (u.isAdmin) return false;
    
    // 2. Se o usuário atual estiver logado, não for administrador, e tiver turmaId,
    // mostrar apenas os alunos da mesma turma
    if (currentUser && !currentUser.isAdmin && currentUser.turmaId) {
      return u.turmaId === currentUser.turmaId;
    }
    
    // 3. Caso contrário, mostra todos os usuários normais (não-administradores)
    return true;
  });

  // Ordena por pontuação de forma decrescente
  return [...filteredUsers].sort((a, b) => b.points - a.points);
}

// Buscar ranking atualizado do servidor Supabase
export async function fetchLeaderboard(currentUser) {
  if (supabase) {
    try {
      const { data: users, error } = await supabase.from('users').select('*');
      if (!error && users) {
        localStorage.setItem('cultiva_users', JSON.stringify(normalizeDbObject(users)));
      }
    } catch (err) {
      console.warn('[Supabase Leaderboard] Erro ao buscar:', err);
    }
  }
  return getLeaderboard(currentUser);
}

// Atribuir Pontuação para um Aluno
export function awardPoints(studentEmail, amount, studentName, activityType = null, activityTitle = null, activityDesc = null) {
  const users = getUsers();
  const cleanEmail = studentEmail.trim().toLowerCase();
  const isAdmin = ADMIN_EMAILS.includes(cleanEmail);

  // Administradores nunca acumulam pontos
  if (isAdmin) {
    return { email: cleanEmail, name: studentName || "Ester Ferreira (ADM)", points: 0, turmaId: null, isAdmin: true };
  }

  let userIndex = users.findIndex(u => u.email === cleanEmail);
  let updatedUser;

  if (userIndex === -1) {
    const startPoints = amount < 0 ? 0 : amount;
    updatedUser = { email: cleanEmail, name: studentName || "Estudante", points: startPoints, turmaId: null, isAdmin: false };
    users.push(updatedUser);
  } else {
    users[userIndex].points += amount;
    if (users[userIndex].points < 0) {
      users[userIndex].points = 0;
    }
    users[userIndex].isAdmin = false;
    updatedUser = users[userIndex];
  }

  saveUsers(users);

  // Registrar a atividade no log de atividades
  if (amount !== 0 || activityType) {
    const todayStr = getTodayDateBR();
    const type = activityType || (amount === 420 ? 'plantio' : amount === 100 ? 'atualizacao' : amount === 5 ? 'curtida' : amount === 10 ? 'comentario' : amount < 0 ? 'penalidade' : 'quiz');
    const title = activityTitle || (amount === 420 ? 'Cultivo Inicial' : amount === 100 ? 'Atualização Semanal' : amount === 5 ? 'Curtida' : amount === 10 ? 'Comentário/Feedback' : amount < 0 ? 'Penalidade' : 'Quiz Ecológico');
    const desc = activityDesc || (amount > 0 ? `Recebeu +${amount} XP` : amount < 0 ? `Perdeu ${amount} XP` : `Completou a atividade`);
    logActivity(cleanEmail, studentName || updatedUser.name || "Estudante", type, title, desc, amount, todayStr);
  }

  // Atualizar a sessão do usuário logado se for ele mesmo
  const session = localStorage.getItem('cultiva_user');
  if (session) {
    const parsed = JSON.parse(session);
    if (parsed.email === cleanEmail) {
      parsed.points = updatedUser.points;
      parsed.isAdmin = updatedUser.isAdmin;
      localStorage.setItem('cultiva_user', JSON.stringify(parsed));
    }
  }

  if (supabase) {
    supabase.from('users').upsert([updatedUser]).then(({ error }) => {
      if (error) console.error('[Supabase Error] awardPoints:', error);
    });
  }

  return updatedUser;
}

// Adicionar uma nova planta (Galeria Verde) -> Ganha 50 Pontos
export function addPlant(studentName, studentEmail, name, species, photoUrl, notes, customStageName) {
  const plants = getPlants();
  const posts = getPosts();

  const newPlantId = 'plant-' + Date.now();
  const todayStr = getTodayDateBR();

  const analysisResult = analyzePlantStage(species, 1);

  const newPhotoEntry = {
    day: 1,
    date: todayStr,
    url: photoUrl || "https://images.unsplash.com/photo-1532467411038-57680e4ded04?w=400&auto=format&fit=crop&q=60",
    stageName: customStageName || analysisResult.stageName,
    analysis: analysisResult.analysis,
    notes: notes || "Plantei minha sementinha!"
  };

  const newPlant = {
    id: newPlantId,
    studentName,
    studentEmail,
    name,
    species,
    startDate: todayStr,
    photos: [newPhotoEntry]
  };

  plants.push(newPlant);
  savePlants(plants);

  // Adicionar automaticamente ao Feed Verde
  const newPost = {
    id: 'post-' + Date.now(),
    plantId: newPlantId,
    studentName,
    studentEmail,
    plantName: name,
    day: 1,
    date: todayStr,
    url: newPhotoEntry.url,
    stageName: newPhotoEntry.stageName,
    notes: newPhotoEntry.notes,
    likes: [],
    comments: []
  };

  posts.unshift(newPost);
  savePosts(posts);

  if (supabase) {
    supabase.from('plants').insert([newPlant]).then(({ error: plantErr }) => {
      if (plantErr) {
        console.error('[Supabase Error] addPlant (plants):', plantErr);
        return;
      }
      supabase.from('posts').insert([newPost]).then(({ error: postErr }) => {
        if (postErr) console.error('[Supabase Error] addPlant (posts):', postErr);
      });
    });
  }

  // Atribuir 420 pontos pelo novo cultivo
  awardPoints(studentEmail, 420, studentName);

  return newPlant;
}

// Adicionar foto semanal para uma planta (Dia 7, Dia 14, etc.) -> Ganha 100 Pontos
export function updatePlantPhoto(plantId, day, photoUrl, notes, customStageName) {
  const plants = getPlants();
  const posts = getPosts();

  const plantIndex = plants.findIndex(p => p.id === plantId);
  if (plantIndex === -1) return null;

  const plant = plants[plantIndex];
  const todayStr = getTodayDateBR();
  const analysisResult = analyzePlantStage(plant.species, day);

  const newPhotoEntry = {
    day: parseInt(day),
    date: todayStr,
    url: photoUrl || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&auto=format&fit=crop&q=60",
    stageName: customStageName || analysisResult.stageName,
    analysis: analysisResult.analysis,
    notes: notes || `Atualização da planta - Dia ${day}`
  };

  plant.photos.push(newPhotoEntry);
  plant.photos.sort((a, b) => a.day - b.day);
  
  plants[plantIndex] = plant;
  savePlants(plants);

  // Adicionar post ao Feed Verde
  const newPost = {
    id: 'post-' + Date.now(),
    plantId: plantId,
    studentName: plant.studentName,
    studentEmail: plant.studentEmail,
    plantName: plant.name,
    day: parseInt(day),
    date: todayStr,
    url: newPhotoEntry.url,
    stageName: newPhotoEntry.stageName,
    notes: newPhotoEntry.notes,
    likes: [],
    comments: []
  };

  posts.unshift(newPost);
  savePosts(posts);

  if (supabase) {
    Promise.all([
      supabase.from('plants').update({ photos: plant.photos }).eq('id', plantId),
      supabase.from('posts').insert([newPost])
    ]).then(([resPlants, resPosts]) => {
      if (resPlants.error) console.error('[Supabase Error] updatePlantPhoto (plants):', resPlants.error);
      if (resPosts.error) console.error('[Supabase Error] updatePlantPhoto (posts):', resPosts.error);
    });
  }

  // Atribuir 100 pontos por nova evolução
  awardPoints(plant.studentEmail, 100, plant.studentName);

  return plant;
}

// Excluir Planta e todos os seus posts associados (Moderação)
export function deletePlant(plantId) {
  const plants = getPlants();
  const posts = getPosts();

  const plant = plants.find(p => p.id === plantId);
  const filteredPlants = plants.filter(p => p.id !== plantId);
  const filteredPosts = posts.filter(p => p.plantId !== plantId);

  savePlants(filteredPlants);
  savePosts(filteredPosts);

  if (supabase) {
    Promise.all([
      supabase.from('plants').delete().eq('id', plantId),
      supabase.from('posts').delete().eq('plantId', plantId)
    ]).then(([resPlants, resPosts]) => {
      if (resPlants.error) console.error('[Supabase Error] deletePlant (plants):', resPlants.error);
      if (resPosts.error) console.error('[Supabase Error] deletePlant (posts):', resPosts.error);
    });
  }

  if (plant) {
    // Deduz 50 pontos por foto removida
    const numPhotos = plant.photos ? plant.photos.length : 1;
    awardPoints(plant.studentEmail, -50 * numPhotos, plant.studentName);
  }

  return filteredPlants;
}

// Curtir / Descurtir Post -> Ganha 5 pontos se for curtir
export function toggleLikePost(postId, studentEmail) {
  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return null;

  const post = posts[postIndex];
  const likedIndex = post.likes.indexOf(studentEmail);
  const isLiking = likedIndex === -1;

  if (isLiking) {
    post.likes.push(studentEmail);
  } else {
    post.likes.splice(likedIndex, 1);
  }

  posts[postIndex] = post;
  savePosts(posts);

  if (supabase) {
    supabase.from('posts').update({ likes: post.likes }).eq('id', postId).then(({ error }) => {
      if (error) console.error('[Supabase Error] toggleLikePost:', error);
    });
  }

  // Se estiver curtindo (e não descurtindo), ganha 5 pontos
  if (isLiking) {
    awardPoints(studentEmail, 5, "Estudante");
  }

  return post;
}

// Comentar no Post -> Ganha 10 pontos
export function addCommentToPost(postId, studentName, studentEmail, text) {
  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return null;

  const post = posts[postIndex];
  const newComment = {
    id: 'c-' + Date.now(),
    studentName,
    studentEmail,
    text,
    date: new Date().toISOString().split('T')[0]
  };

  post.comments.push(newComment);
  posts[postIndex] = post;
  savePosts(posts);

  if (supabase) {
    supabase.from('posts').update({ comments: post.comments }).eq('id', postId).then(({ error }) => {
      if (error) console.error('[Supabase Error] addCommentToPost:', error);
    });
  }

  // Atribuir 10 pontos pelo comentário construtivo
  awardPoints(studentEmail, 10, studentName);

  return post;
}

// Excluir Post (Moderação)
export function deletePost(postId) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  const filtered = posts.filter(p => p.id !== postId);
  savePosts(filtered);

  if (supabase) {
    supabase.from('posts').delete().eq('id', postId).then(({ error }) => {
      if (error) console.error('[Supabase Error] deletePost:', error);
    });
  }

  if (post) {
    removePhotoFromPlant(post.plantId, post.day);
    // Deduz 50 pontos no ranking por foto removida pelo ADM
    awardPoints(post.studentEmail, -50, post.studentName);
  }

  return filtered;
}

// Remove uma foto específica do histórico de uma planta
export function removePhotoFromPlant(plantId, day) {
  const plants = getPlants();
  const idx = plants.findIndex(p => p.id === plantId);
  if (idx === -1) return;

  const plant = plants[idx];
  const updatedPhotos = (plant.photos || []).filter(photo => photo.day !== parseInt(day));

  if (updatedPhotos.length === 0) {
    // Se não restarem fotos, exclui a planta inteira
    const filteredPlants = plants.filter(p => p.id !== plantId);
    savePlants(filteredPlants);
    if (supabase) {
      supabase.from('plants').delete().eq('id', plantId).then(({ error }) => {
        if (error) console.error('[Supabase Error] deletePlant (empty photos):', error);
      });
    }
  } else {
    // Caso contrário, atualiza a planta com as fotos restantes
    plant.photos = updatedPhotos;
    plants[idx] = plant;
    savePlants(plants);
    if (supabase) {
      supabase.from('plants').update({ photos: updatedPhotos }).eq('id', plantId).then(({ error }) => {
        if (error) console.error('[Supabase Error] updatePlantPhotos (after delete):', error);
      });
    }
  }
}

// Excluir uma foto da galeria e o post correspondente no feed (Moderação)
export function deletePlantPhoto(plantId, day) {
  const plants = getPlants();
  const plant = plants.find(p => p.id === plantId);
  
  // 1. Remover a foto da planta
  removePhotoFromPlant(plantId, day);

  // 2. Remover o post correspondente
  const posts = getPosts();
  const targetPost = posts.find(p => p.plantId === plantId && p.day === parseInt(day));
  
  if (targetPost) {
    // Deleta o post, o que por consequência deduz os 50 pontos
    deletePost(targetPost.id);
  } else {
    // Se por acaso não tinha post no feed (só na timeline), deduz os 50 pontos aqui
    if (plant) {
      awardPoints(plant.studentEmail, -50, plant.studentName);
    }
  }
}

// Excluir Comentário (Moderação)
export function deleteComment(postId, commentId) {
  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return null;

  const post = posts[postIndex];
  post.comments = post.comments.filter(c => c.id !== commentId);
  posts[postIndex] = post;
  savePosts(posts);

  if (supabase) {
    supabase.from('posts').update({ comments: post.comments }).eq('id', postId).then(({ error }) => {
      if (error) console.error('[Supabase Error] deleteComment:', error);
    });
  }

  return post;
}

// Obter feedbacks da aula
export function getClassFeedback() {
  initDb();
  return JSON.parse(localStorage.getItem('cultiva_feedback') || '[]');
}

// Enviar feedback da aula (ganha 10 pontos de recompensa!)
export function submitClassFeedback(studentEmail, studentName, vote) {
  initDb();
  const feedbackList = getClassFeedback();
  const cleanEmail = studentEmail.trim().toLowerCase();
  
  const existingIdx = feedbackList.findIndex(f => f.email === cleanEmail);
  const feedbackEntry = {
    email: cleanEmail,
    name: studentName,
    vote,
    date: getTodayDateBR()
  };

  if (existingIdx > -1) {
    feedbackList[existingIdx] = feedbackEntry;
  } else {
    feedbackList.push(feedbackEntry);
  }

  localStorage.setItem('cultiva_feedback', JSON.stringify(feedbackList));

  if (supabase) {
    const emojiMap = { '😍': 4, '🙂': 3, '😐': 2, '😢': 1 };
    const dbVote = emojiMap[vote] || 4;
    const dbEntry = { ...feedbackEntry, vote: dbVote };
    supabase.from('feedback').upsert([dbEntry]).then(({ error }) => {
      if (error) console.error('[Supabase Error] submitClassFeedback:', error);
    });
  }
  
  // Dar 10 pontos ao estudante como incentivo por votar
  awardPoints(cleanEmail, 10, studentName);

  return feedbackList;
}

// Compactar imagem usando Canvas para evitar falhas de payload no Supabase e LocalStorage
export function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Verifica se passarem mais de 7 dias sem atualizar e desconta 50 pontos
export function checkInactivityPenalties(studentEmail) {
  if (!studentEmail) return false;
  
  // E-mails administrativos não participam de ranking/penalidades
  if (ADMIN_EMAILS.includes(studentEmail.trim().toLowerCase())) return false;

  const plants = getPlants();
  const todayStr = new Date().toISOString().split('T')[0];
  const today = new Date(todayStr);

  let updatedAny = false;

  const updatedPlants = plants.map(plant => {
    if (plant.studentEmail.trim().toLowerCase() !== studentEmail.trim().toLowerCase()) {
      return plant;
    }
    if (!plant.photos || plant.photos.length === 0) {
      return plant;
    }

    // Obter data da última foto
    const lastPhoto = plant.photos[plant.photos.length - 1];
    const lastPhotoDate = new Date(lastPhoto.date);

    // Calcular diferença em dias
    const diffTime = today.getTime() - lastPhotoDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      // Verificar se já foi penalizado por esta inatividade (último período pós-última-foto)
      const lastPenalty = plant.lastPenaltyDate ? new Date(plant.lastPenaltyDate) : null;
      
      // Se não foi penalizado ainda desde a última foto ou a última penalidade foi antes/junto da última foto
      if (!lastPenalty || lastPenalty.getTime() <= lastPhotoDate.getTime()) {
        // Deduz 50 pontos
        awardPoints(studentEmail, -50, plant.studentName);
        plant.lastPenaltyDate = todayStr;
        updatedAny = true;
      }
    }
    return plant;
  });

  if (updatedAny) {
    savePlants(updatedPlants);
    if (supabase) {
      // Sincronizar com o Supabase para cada planta atualizada
      updatedPlants.forEach(plant => {
        if (plant.studentEmail.trim().toLowerCase() === studentEmail.trim().toLowerCase() && plant.lastPenaltyDate === todayStr) {
          supabase.from('plants').update({ lastPenaltyDate: todayStr }).eq('id', plant.id).then(({ error }) => {
            if (error) console.error('[Supabase Error] update lastPenaltyDate:', error);
          });
        }
      });
    }
  }

  return updatedAny;
}

