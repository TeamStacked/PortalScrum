SELECT COUNT(*) AS total_modulos FROM public.modulos;

SELECT COUNT(*) AS total_questoes FROM public.questoes;

SELECT 
  m.id_modulo,
  m.titulo,
  COUNT(q.id_questao) AS total_questoes
FROM public.modulos m
LEFT JOIN public.questoes q ON q.id_modulo = m.id_modulo
GROUP BY m.id_modulo, m.titulo
ORDER BY m.id_modulo;