-- ====================================================================
-- ComparaEVs — atualizacao PBEV 2026 (tabela de 25/ago/2026)
-- Rodar no SQL Editor do Supabase (a chave anon do site so tem SELECT).
--
--   1. 10 normalizacoes  (nao mexem em preco/site/imagem/Uber)
--   2. 58 modelos novos
--   3.  6 exclusoes      (saidos do PBEV; backup no passo 0)
--
-- VERSAO QUE EFETIVA. Roda em transacao e termina em COMMIT: se qualquer
-- comando falhar, o Postgres desfaz tudo sozinho e nada e gravado pela metade.
-- O passo 4 mostra as contagens DEPOIS de efetivado (esperado: 180 / 58).
-- ====================================================================

begin;

-- ------------------------------------------------------------------
-- 0) COMO DESFAZER as exclusoes do passo 3 (guarde este bloco).
--    Tambem esta em _backup_excluidos.json.
-- ------------------------------------------------------------------
--   insert into pbe_veiculos_eletricos ("Categoria", "Marca", "Modelo_Versao", "Propulsao", "Transmissao", "Direcao", "Combustivel", "Cidade_kmLe", "Estrada_kmLe", "Consumo_MJkm", "Autonomia_km", "Class_Cat", "Class_Geral", "id", "ano_tabela", "codigo", "ano", "preco", "site", "imagem", "fonte_preco", "Uber") values ('Comercial', 'Fiat', 'E-SCUDO CARGO ELÉTRICO', 'Elétrico', 'A-1', 'E', 'E', 28.1, 26.1, 0.75, 258, 'A', 'A', 108, 2026, 21, '2025', 198000.0, 'https://www.fiat.com.br', NULL, 'Tabela Fipe', NULL);
--   insert into pbe_veiculos_eletricos ("Categoria", "Marca", "Modelo_Versao", "Propulsao", "Transmissao", "Direcao", "Combustivel", "Cidade_kmLe", "Estrada_kmLe", "Consumo_MJkm", "Autonomia_km", "Class_Cat", "Class_Geral", "id", "ano_tabela", "codigo", "ano", "preco", "site", "imagem", "fonte_preco", "Uber") values ('Fora de Estrada Grande', 'Mercedes-Benz', 'G580 EQ', 'Elétrico', 'A-1', 'E', 'E', 25.8, 20.6, 0.88, 369, 'A', 'A', 96, 2026, 39, NULL, 1849000.0, 'https://www.mercedes-benz.com.br', NULL, 'Pesquisa de Mercado 2026', NULL);
--   insert into pbe_veiculos_eletricos ("Categoria", "Marca", "Modelo_Versao", "Propulsao", "Transmissao", "Direcao", "Combustivel", "Cidade_kmLe", "Estrada_kmLe", "Consumo_MJkm", "Autonomia_km", "Class_Cat", "Class_Geral", "id", "ano_tabela", "codigo", "ano", "preco", "site", "imagem", "fonte_preco", "Uber") values ('Comercial', 'Mercedes-Benz', '320 ESPRINTER F', 'Elétrico', 'A-1', 'E', 'E', 21.1, 16.3, 1.09, 206, 'A', 'B', 120, 2026, 39, NULL, 489900.0, 'https://www.mercedes-benz.com.br', NULL, 'Pesquisa de Mercado 2026', NULL);
--   insert into pbe_veiculos_eletricos ("Categoria", "Marca", "Modelo_Versao", "Propulsao", "Transmissao", "Direcao", "Combustivel", "Cidade_kmLe", "Estrada_kmLe", "Consumo_MJkm", "Autonomia_km", "Class_Cat", "Class_Geral", "id", "ano_tabela", "codigo", "ano", "preco", "site", "imagem", "fonte_preco", "Uber") values ('Comercial', 'Mercedes-Benz', '320 ESPRINTER C', 'Elétrico', 'A-1', 'E', 'E', 21.1, 16.3, 1.09, 206, 'A', 'B', 121, 2026, 39, NULL, 489900.0, 'https://www.mercedes-benz.com.br', NULL, 'Pesquisa de Mercado 2026', NULL);
--   insert into pbe_veiculos_eletricos ("Categoria", "Marca", "Modelo_Versao", "Propulsao", "Transmissao", "Direcao", "Combustivel", "Cidade_kmLe", "Estrada_kmLe", "Consumo_MJkm", "Autonomia_km", "Class_Cat", "Class_Geral", "id", "ano_tabela", "codigo", "ano", "preco", "site", "imagem", "fonte_preco", "Uber") values ('Extra Grande', 'Kia Motors', 'EV5 2WD AIR 2WD ELÉTRICO', 'Elétrico', 'A-1', 'E', 'E', 37.6, 30.5, 0.6, 402, 'A', 'A', 75, 2026, 31, NULL, 309990.0, 'https://www.kia.com/br', NULL, 'Pesquisa de Mercado 2026', NULL);
--   insert into pbe_veiculos_eletricos ("Categoria", "Marca", "Modelo_Versao", "Propulsao", "Transmissao", "Direcao", "Combustivel", "Cidade_kmLe", "Estrada_kmLe", "Consumo_MJkm", "Autonomia_km", "Class_Cat", "Class_Geral", "id", "ano_tabela", "codigo", "ano", "preco", "site", "imagem", "fonte_preco", "Uber") values ('Extra Grande', 'Kia Motors', 'EV5 2WD LAND 2WD ELÉTRICO', 'Elétrico', 'A-1', 'E', 'E', 37.6, 30.5, 0.6, 402, 'A', 'A', 76, 2026, 31, NULL, 309990.0, 'https://www.kia.com/br', NULL, 'Pesquisa de Mercado 2026', NULL);

-- ------------------------------------------------------------------
-- 1) Normalizacoes
--    Fora daqui de proposito: Transmissao "A" -> "Automatica (A)" nas 3
--    linhas da Chevrolet. O PDF escreve por extenso so nelas e o resto da
--    tabela usa o codigo curto; propagar deixaria o banco menos coerente.
-- ------------------------------------------------------------------
update pbe_veiculos_eletricos set "Cidade_kmLe" = 58.59 where id = 1;  -- BYD DOLPHIN MINI GS EV
update pbe_veiculos_eletricos set "Direcao" = 'E' where id = 99;  -- FARIZON V6E --
update pbe_veiculos_eletricos set "Direcao" = 'E' where id = 100;  -- FARIZON SV AIR 11M3
update pbe_veiculos_eletricos set "Direcao" = 'E' where id = 101;  -- FARIZON SV AIR PRO11M3
update pbe_veiculos_eletricos set "Direcao" = 'E' where id = 102;  -- FARIZON SV LUX 11M3
update pbe_veiculos_eletricos set "Direcao" = 'E' where id = 103;  -- FARIZON SV LUX PRO11M3
update pbe_veiculos_eletricos set "Direcao" = 'E' where id = 104;  -- FARIZON SV AIR 8M3
update pbe_veiculos_eletricos set "Direcao" = 'E' where id = 105;  -- FARIZON SV AIR PRO 8M3
update pbe_veiculos_eletricos set "Direcao" = 'E' where id = 106;  -- FARIZON SV LUX 8M3
update pbe_veiculos_eletricos set "Direcao" = 'E' where id = 107;  -- FARIZON SV LUX PRO 8M3

-- ------------------------------------------------------------------
-- 2) Modelos novos — entram SEM preco e SEM link de oferta.
--    Aparecem na tabela do site (o filtro deixa passar preco nulo) e
--    ficam fora do simulador de financiamento, que exige preco.
--    Planilha para precificar: _pbev_novos.csv
-- ------------------------------------------------------------------
insert into pbe_veiculos_eletricos ("Marca", "Modelo_Versao", "Categoria", "Propulsao", "Transmissao", "Direcao", "Combustivel", "Cidade_kmLe", "Estrada_kmLe", "Consumo_MJkm", "Autonomia_km", "Class_Cat", "Class_Geral", "ano_tabela") values
  ('FOTON', 'ETOANO PRO H', 'Comercial', 'Elétrico', 'A-1', 'E', 'E', 20.6, 18.1, 1.05, 179, 'A', 'B', 2026),
  ('FOTON', 'ETOANO PRO M', 'Comercial', 'Elétrico', 'A-1', 'E', 'E', 23.5, 17.6, 1.0, 198, 'A', 'B', 2026),
  ('FOTON', 'EVIEW GRAND77', 'Comercial', 'Elétrico', 'A-1', 'E', 'E', 20.2, 20.5, 1.0, 187, 'A', 'B', 2026),
  ('MERCEDES-BENZ', '320 E SPRINTER Chassi', 'Comercial', 'Elétrico', 'A-1', 'E', 'E', 21.1, 16.3, 1.09, 206, 'A', 'B', 2026),
  ('MERCEDES-BENZ', '320 E SPRINTER Furgão', 'Comercial', 'Elétrico', 'A-1', 'E', 'E', 21.1, 16.3, 1.09, 206, 'A', 'B', 2026),
  ('PEUGEOT', 'E-EXPERT CARGO', 'Comercial', 'Elétrico', 'A-1', 'E', 'E', 28.1, 26.1, 0.75, 258, 'A', 'A', 2026),
  ('RENAULT', 'E-KWID CARGO', 'Comercial', 'Elétrico', 'A', 'E', 'E', 52.7, 39.6, 0.44, 185, 'A', 'A', 2026),
  ('RENAULT', 'KANGOO ETECHL2', 'Comercial', 'Elétrico', 'A', 'E', 'E', 37.5, 30.3, 0.6, 210, 'A', 'A', 2026),
  ('MINI', 'Cooper E', 'Compacto', 'Elétrico', 'A', 'E', 'E', 48.0, 39.7, 0.46, 239, 'A', 'A', 2026),
  ('MINI', 'Cooper SE', 'Compacto', 'Elétrico', 'A', 'E', 'E', 46.1, 38.4, 0.48, 312, 'A', 'A', 2026),
  ('MINI', 'JCW-E 3P', 'Compacto', 'Elétrico', 'A', 'E', 'E', 43.8, 40.2, 0.48, 306, 'A', 'A', 2026),
  ('PEUGEOT', 'E-208 GT', 'Compacto', 'Elétrico', 'A-1', 'E', 'E', 37.8, 30.8, 0.59, 220, 'A', 'A', 2026),
  ('MG', 'CYBERSTER 77 KWH AWD', 'Esportivo', 'Elétrico', 'A-1', 'E', 'E', 38.9, 33.9, 0.56, 342, 'A', 'A', 2026),
  ('PORSCHE', 'TAYCAN TURBOGT', 'Esportivo', 'Elétrico', '--', 'E', 'E', 33.7, 29.7, 0.64, 442, 'A', 'A', 2026),
  ('AUDI', 'A6 Avant e-tron S line', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 37.0, 31.1, 0.6, 474, 'A', 'A', 2026),
  ('AUDI', 'A6 e-tron Performance black', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 36.4, 31.8, 0.59, 445, 'A', 'A', 2026),
  ('AUDI', 'A6 e-tron S line', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 36.5, 32.2, 0.59, 443, 'A', 'A', 2026),
  ('AUDI', 'Q6 Sportback e-tron Quattro S line', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 35.7, 31.5, 0.6, 432, 'A', 'A', 2026),
  ('AUDI', 'Q6 e-tron Quattro Dynamic', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 35.3, 30.6, 0.61, 424, 'A', 'A', 2026),
  ('AUDI', 'Q6 e-tron Quattro S line', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 35.3, 30.6, 0.61, 424, 'A', 'A', 2026),
  ('AUDI', 'RS e-tron GT Performance', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 25.2, 25.9, 0.8, 348, 'A', 'A', 2026),
  ('BMW', 'iX3 50 XDRIVE MSP', 'Extra Grande', 'Elétrico', 'A', 'E', 'E', 38.7, 35.7, 0.54, 570, 'A', 'A', 2026),
  ('BYD', 'SEALION 7 GS 690EV', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 33.2, 28.2, 0.66, 360, 'A', 'A', 2026),
  ('CAOA', 'CHANGAN AVATR 11 EV', 'Extra Grande', 'Elétrico', 'A', 'E', 'E', 35.0, 32.2, 0.6, 497, 'A', 'A', 2026),
  ('KIA', 'EV5 2WD AIR 2WD', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 37.6, 30.5, 0.6, 402, 'A', 'A', 2026),
  ('KIA', 'EV5 2WD LAND 2WD', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 37.6, 30.5, 0.6, 402, 'A', 'A', 2026),
  ('LEAPMOTOR', 'B10 LIFE', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 41.2, 32.8, 0.55, 288, 'A', 'A', 2026),
  ('LEXUS', 'RZ 500e', 'Extra Grande', 'Elétrico', 'CVT', 'E', 'E', 39.1, 32.3, 0.57, 357, 'A', 'A', 2026),
  ('Mercedes-Benz', 'EQB250+', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 40.3, 36.6, 0.53, 376, 'A', 'A', 2026),
  ('Mercedes-Benz', 'GLB250 EV AMGL', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 37.8, 33.4, 0.57, 427, 'A', 'A', 2026),
  ('PORSCHE', 'CAYENNE E', 'Extra Grande', 'Elétrico', '--', 'E', 'E', 35.0, 29.5, 0.63, 493, 'A', 'A', 2026),
  ('PORSCHE', 'CAYENNE E C', 'Extra Grande', 'Elétrico', '--', 'E', 'E', 35.0, 29.5, 0.63, 493, 'A', 'A', 2026),
  ('PORSCHE', 'CAYENNE E CO', 'Extra Grande', 'Elétrico', '--', 'E', 'E', 35.0, 29.5, 0.63, 493, 'A', 'A', 2026),
  ('PORSCHE', 'CAYENNE E OF', 'Extra Grande', 'Elétrico', '--', 'E', 'E', 35.0, 29.5, 0.63, 493, 'A', 'A', 2026),
  ('PORSCHE', 'MACAN EGTS', 'Extra Grande', 'Elétrico', '--', 'E', 'E', 36.1, 30.6, 0.61, 441, 'A', 'A', 2026),
  ('VOLVO', 'ES90 TWIN PE ULT', 'Extra Grande', 'Elétrico', 'A-1', 'E', 'E', 38.9, 34.3, 0.55, 524, 'A', 'A', 2026),
  ('ZEEKR', '7X Flagship AWD', 'Extra Grande', 'Elétrico', 'A', 'E', 'E', 34.5, 29.0, 0.64, 423, 'A', 'A', 2026),
  ('ZEEKR', '7X Premium RWD', 'Extra Grande', 'Elétrico', 'A', 'E', 'E', 39.5, 34.0, 0.55, 491, 'A', 'A', 2026),
  ('BYD', 'YUAN PLUS GS 560EV', 'Grande', 'Elétrico', 'N.A.', 'E', 'E', 38.3, 32.0, 0.58, 378, 'A', 'A', 2026),
  ('GAC', 'AION UT ELITE', 'Grande', 'Elétrico', 'A-1', 'E', 'E', 38.3, 32.3, 0.57, 310, 'A', 'A', 2026),
  ('GAC', 'AION UT PREMIUM', 'Grande', 'Elétrico', 'A-1', 'E', 'E', 43.7, 35.3, 0.51, 253, 'A', 'A', 2026),
  ('GWM', 'ORA 5', 'Grande', 'Elétrico', 'A-1', 'E', 'E', 44.8, 37.1, 0.49, 349, 'A', 'A', 2026),
  ('MG', 'MG4 URB EV43KWH COM', 'Grande', 'Elétrico', 'A-1', 'E', 'E', 56.8, 44.0, 0.4, 299, 'A', 'A', 2026),
  ('MG', 'MG4 URB EV43KWH LUX', 'Grande', 'Elétrico', 'A-1', 'E', 'E', 56.8, 44.0, 0.4, 299, 'A', 'A', 2026),
  ('MG', 'MG4 URB EV54KWH COM', 'Grande', 'Elétrico', 'A-1', 'E', 'E', 53.0, 42.8, 0.42, 358, 'A', 'A', 2026),
  ('MG', 'MG4 URB EV54KWH LUX', 'Grande', 'Elétrico', 'A-1', 'E', 'E', 53.0, 42.8, 0.42, 358, 'A', 'A', 2026),
  ('BYD', 'DOLPHIN SE 290EV', 'Médio', 'Elétrico', 'N.A.', 'E', 'E', 45.8, 36.7, 0.49, 272, 'A', 'A', 2026),
  ('GWM', 'ORA 03 BEV58 C', 'Médio', 'Elétrico', 'A-1', 'E', 'E', 42.8, 36.1, 0.51, 315, 'A', 'A', 2026),
  ('SUZUKI', 'e-Vitara 4STY 2WD', 'Médio', 'Elétrico', 'A-1', 'E', 'E', 41.5, 34.3, 0.54, 317, 'A', 'A', 2026),
  ('SUZUKI', 'e-Vitara 4STY 4WD', 'Médio', 'Elétrico', 'A-1', 'E', 'E', 37.8, 31.6, 0.58, 293, 'A', 'A', 2026),
  ('VOLVO', 'EX30 CROSSC PLUS', 'Utilitário Esp. Comp. 4x4', 'Elétrico', 'A-1', 'E', 'E', 37.8, 31.8, 0.58, 333, 'A', 'A', 2026),
  ('VOLVO', 'EX40 6 CORE', 'Utilitário Esp. Gde.', 'Elétrico', 'A-1', 'E', 'E', 39.4, 34.3, 0.55, 364, 'A', 'A', 2026),
  ('VOLVO', 'EX40 6 PLUS', 'Utilitário Esp. Gde.', 'Elétrico', 'A-1', 'E', 'E', 39.4, 34.3, 0.55, 364, 'A', 'A', 2026),
  ('VOLVO', 'EX40 6 ULTRA', 'Utilitário Esp. Gde.', 'Elétrico', 'A-1', 'E', 'E', 39.4, 34.3, 0.55, 364, 'A', 'A', 2026),
  ('PORSCHE', 'CAYENNE ET', 'Utilitário Esp. Gde. 4x4', 'Elétrico', '--', 'E', 'E', 34.3, 29.1, 0.64, 481, 'A', 'A', 2026),
  ('PORSCHE', 'CAYENNE ET C', 'Utilitário Esp. Gde. 4x4', 'Elétrico', '--', 'E', 'E', 34.3, 29.1, 0.64, 481, 'A', 'A', 2026),
  ('PORSCHE', 'CAYENNE ET CO', 'Utilitário Esp. Gde. 4x4', 'Elétrico', '--', 'E', 'E', 34.3, 29.1, 0.64, 481, 'A', 'A', 2026),
  ('PORSCHE', 'CAYENNE ET OF', 'Utilitário Esp. Gde. 4x4', 'Elétrico', '--', 'E', 'E', 34.3, 29.1, 0.64, 481, 'A', 'A', 2026);

-- ------------------------------------------------------------------
-- 3) Modelos que sairam do PBEV de 25/ago/2026.
--    Conferido no texto do PDF: nao aparecem mesmo, nao e falha de
--    casamento de nome. Todos tinham preco e link curados (ver passo 0).
-- ------------------------------------------------------------------
delete from pbe_veiculos_eletricos where id = 108;  -- Fiat E-SCUDO CARGO ELÉTRICO (R$ 198000.0)
delete from pbe_veiculos_eletricos where id = 75;  -- Kia Motors EV5 2WD AIR 2WD ELÉTRICO (R$ 309990.0)
delete from pbe_veiculos_eletricos where id = 76;  -- Kia Motors EV5 2WD LAND 2WD ELÉTRICO (R$ 309990.0)
delete from pbe_veiculos_eletricos where id = 96;  -- Mercedes-Benz G580 EQ (R$ 1849000.0)
delete from pbe_veiculos_eletricos where id = 120;  -- Mercedes-Benz 320 ESPRINTER F (R$ 489900.0)
delete from pbe_veiculos_eletricos where id = 121;  -- Mercedes-Benz 320 ESPRINTER C (R$ 489900.0)

commit;

-- ------------------------------------------------------------------
-- 4) Conferencia, ja com tudo gravado. Esperado: 180 / 58.
-- ------------------------------------------------------------------
select count(*) as total,
       count(*) filter (where preco is null) as sem_preco,
       count(*) filter (where "ano_tabela" = 2026) as tabela_2026
  from pbe_veiculos_eletricos;
