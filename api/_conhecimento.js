// Base de conhecimento da busca com IA (perguntas que NÃO são "ache um carro").
// O Redator só pode responder com o que está aqui + os fatos ao vivo do banco.
// ponytail: texto copiado de sobre.html, contato.html e do FAQ/guia do
// index.html — se essas páginas mudarem, atualizar aqui também. Se crescer
// muito, trocar por busca vetorial (como no GramAldo/Unopar).
export const CONHECIMENTO = [
  {
    titulo: "O que é o ComparaEVs",
    texto:
      "O ComparaEVs é uma central independente de comparação de carros elétricos do Brasil. Reúne os dados oficiais de autonomia, consumo energético e classificação de eficiência do Programa Brasileiro de Etiquetagem Veicular (PBEV), coordenado pelo INMETRO, numa ferramenta de comparação lado a lado, com filtros por preço, autonomia, consumo e categoria. O site também tem páginas de Motos e de Carregadores.",
  },
  {
    titulo: "O que o ComparaEVs não faz",
    texto:
      "Não vende veículos, não é concessionária e não recebe comissão por venda. Conteúdo de marcas parceiras é sempre identificado como \"Patrocinado\" ou \"Apresentado por\"; a comparação de dados técnicos é sempre baseada nas fontes oficiais, independente de patrocínio.",
  },
  {
    titulo: "Fonte e atualização dos dados",
    texto:
      "Os dados técnicos (autonomia, consumo, classificação) vêm do PBEV/INMETRO. A base é atualizada conforme novos modelos são homologados e etiquetados. Os preços exibidos têm como fonte padrão a Tabela Fipe; veículos sem preço aparecem como \"Consulte\".",
  },
  {
    titulo: "Como é calculado o custo por 100 km",
    texto:
      "O custo por 100 km é calculado a partir do consumo do veículo (MJ/km, convertido para kWh/km dividindo por 3,6) multiplicado pela tarifa de energia (R$/kWh) e por 100. A tarifa padrão é uma estimativa editável (R$ 0,85/kWh) — o usuário deve ajustar para a tarifa real da sua conta de luz.",
  },
  {
    titulo: "Selo PBEV/INMETRO",
    texto:
      "É a Etiqueta Nacional de Conservação de Energia aplicada a veículos, emitida pelo PBEV sob coordenação do INMETRO. Classifica os modelos de A+ (mais eficiente) a G, com base em testes oficiais e padronizados de consumo energético e autonomia — mesma lógica das etiquetas de eletrodomésticos.",
  },
  {
    titulo: "Autonomia anunciada x real",
    texto:
      "A autonomia oficial (PBEV/INMETRO) é medida em condições padronizadas de teste, que servem para comparar modelos de forma justa entre si. No uso real ela varia para baixo ou para cima conforme clima, estilo de condução, peso e uso de ar-condicionado. Use como referência comparativa, não como garantia de quilometragem.",
  },
  {
    titulo: "Tempo de recarga",
    texto:
      "Depende do carregador. Em tomada residencial comum, de 8 a 20 horas para carga completa. Em wallbox residencial dedicada, de 4 a 8 horas. Em carregadores rápidos públicos (DC), 80% da carga em 20 a 40 minutos, conforme o carro e a potência do carregador. A maioria dos elétricos vem com cabo para tomada residencial, mas é a forma mais lenta, recomendada só ocasionalmente; para uso diário o ideal é a wallbox.",
  },
  {
    titulo: "Frio, calor e bateria",
    texto:
      "Temperaturas muito baixas reduzem a eficiência química da bateria, e o ar-condicionado consome energia da mesma bateria que move o carro; no Brasil o efeito costuma ser menor que em países de inverno rigoroso, mas é perceptível em dias muito quentes. Todas as baterias de íon-lítio perdem capacidade gradualmente com os ciclos de carga; por isso as marcas dão garantia específica da bateria (geralmente de 8 anos ou mais), normalmente maior que a garantia geral do veículo.",
  },
  {
    titulo: "Como escolher um carro elétrico",
    texto:
      "Pontos que mais pesam: (1) autonomia real, não só a anunciada; (2) onde e como você vai recarregar — quem recarrega em casa toda noite sofre menos com autonomia curta; (3) consumo energético: quanto menor, mais eficiente e mais barato por km; (4) classificação PBEV/INMETRO; (5) custo total de propriedade, não só o preço de tabela — elétricos costumam custar mais na compra e menos para manter (sem troca de óleo, menos desgaste, energia mais barata que gasolina por km); (6) garantia da bateria.",
  },
  {
    titulo: "Uber",
    texto:
      "O filtro \"Aceitos pela Uber\" marca os veículos que constam como aceitos na categoria Uber, mas a elegibilidade deve sempre ser verificada no app da Uber.",
  },
  {
    titulo: "Contato, correção de dados e publicidade",
    texto:
      "Para dado incorreto, sugestão de modelo que falta, parceria ou patrocínio: e-mail daniel@comparaevs.com.br ou WhatsApp (54) 98143-2889. Propostas de publicidade devem indicar o assunto \"Publicidade\". Há também o botão \"Sugerir correção\" no site e a opção de pedir orçamento de instalação de carregador residencial.",
  },
];
