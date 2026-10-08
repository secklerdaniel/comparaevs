-- Corrige a grafia da marca nas linhas importadas do PBEV 2026.
-- Eu gravei a marca em CAIXA ALTA, como vem no PDF, em vez de seguir a
-- grafia que o banco ja usava. Isso fez 7 marcas aparecerem duas vezes no
-- filtro do site. Aqui cada grafia nova volta para a que ja existia.
-- Marcas que sao sigla (BYD, BMW, MG, GAC, GWM, JAC, ZEEKR...) ficam como estao.

begin;

update pbe_veiculos_eletricos set "Marca" = 'Audi' where "Marca" = 'AUDI';  -- 7 linha(s)
update pbe_veiculos_eletricos set "Marca" = 'Leapmotor' where "Marca" = 'LEAPMOTOR';  -- 1 linha(s)
update pbe_veiculos_eletricos set "Marca" = 'Mercedes-Benz' where "Marca" = 'MERCEDES-BENZ';  -- 2 linha(s)
update pbe_veiculos_eletricos set "Marca" = 'Peugeot' where "Marca" = 'PEUGEOT';  -- 2 linha(s)
update pbe_veiculos_eletricos set "Marca" = 'Porsche' where "Marca" = 'PORSCHE';  -- 10 linha(s)
update pbe_veiculos_eletricos set "Marca" = 'Renault' where "Marca" = 'RENAULT';  -- 2 linha(s)
update pbe_veiculos_eletricos set "Marca" = 'Volvo' where "Marca" = 'VOLVO';  -- 5 linha(s)

commit;

-- Conferencia: nao deve sobrar nenhuma marca duplicada por caixa.
select upper("Marca") as chave, count(distinct "Marca") as grafias,
       string_agg(distinct "Marca", ' | ') as como_esta
  from pbe_veiculos_eletricos group by 1 having count(distinct "Marca") > 1;
