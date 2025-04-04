export interface InfoMovimento {
    nomeMovimento: string;
    descricaoMovimento: string;
    atualizacaoMovimento: string;
    numeroProcesso: string; // Este campo é agora parte de cada movimento
  }
  
  export const movimentos: InfoMovimento[] = [
    {
      nomeMovimento: "Distribuição",
      descricaoMovimento: "O processo foi distribuído e encaminhado para análise.",
      atualizacaoMovimento: "2018-10-30T14:06:24.000Z",
      numeroProcesso: "00008323520184013202",
    },
    {
      nomeMovimento: "Conclusão ao Juiz",
      descricaoMovimento: "O processo foi enviado ao juiz para decisão.",
      atualizacaoMovimento: "2019-02-15T09:30:00.000Z",
      numeroProcesso: "00008323520184013202",
    },
    {
      nomeMovimento: "Despacho",
      descricaoMovimento: "Juiz emitiu despacho sobre o andamento do processo.",
      atualizacaoMovimento: "2019-05-10T16:45:12.000Z",
      numeroProcesso: "00008323520184013202",
    },
    {
      nomeMovimento: "Audiência Realizada",
      descricaoMovimento: "Audiência ocorreu com as partes envolvidas.",
      atualizacaoMovimento: "2019-07-22T11:00:30.000Z",
      numeroProcesso: "00008323520184013202",
    },
    {
      nomeMovimento: "Sentença Proferida",
      descricaoMovimento: "Juiz proferiu a sentença do processo.",
      atualizacaoMovimento: "2019-12-05T15:20:45.000Z",
      numeroProcesso: "00008323520184013202",
    },
    {
      nomeMovimento: "Conversão de Autos Físicos em Eletrônicos",
      descricaoMovimento: "O processo físico foi convertido para o formato eletrônico.",
      atualizacaoMovimento: "2020-08-05T01:15:18.000Z",
      numeroProcesso: "00008323520184013202",
    },
    {
      nomeMovimento: "Trânsito em Julgado",
      descricaoMovimento: "A decisão do processo transitou em julgado sem possibilidade de recurso.",
      atualizacaoMovimento: "2021-02-10T08:30:00.000Z",
      numeroProcesso: "00008323520184013202",
    },
    {
      nomeMovimento: "Em Execução",
      descricaoMovimento: "O processo está em fase de execução.",
      atualizacaoMovimento: "2021-06-20T10:45:00.000Z",
      numeroProcesso: "00008323520184013202",
    },
  
    // Outros movimentos para outro processo
    {
      nomeMovimento: "Distribuição",
      descricaoMovimento: "O processo foi distribuído e encaminhado para análise.",
      atualizacaoMovimento: "2018-10-30T14:06:24.000Z",
      numeroProcesso: "00001234520234013201",
    },
    {
      nomeMovimento: "Conclusão ao Juiz",
      descricaoMovimento: "O processo foi enviado ao juiz para decisão.",
      atualizacaoMovimento: "2019-02-15T09:30:00.000Z",
      numeroProcesso: "00001234520234013201",
    },
    {
      nomeMovimento: "Despacho",
      descricaoMovimento: "Juiz emitiu despacho sobre o andamento do processo.",
      atualizacaoMovimento: "2019-05-10T16:45:12.000Z",
      numeroProcesso: "00001234520234013201",
    },
    {
      nomeMovimento: "Audiência Realizada",
      descricaoMovimento: "Audiência ocorreu com as partes envolvidas.",
      atualizacaoMovimento: "2019-07-22T11:00:30.000Z",
      numeroProcesso: "00001234520234013201",
    },
    {
      nomeMovimento: "Sentença Proferida",
      descricaoMovimento: "Juiz proferiu a sentença do processo.",
      atualizacaoMovimento: "2019-12-05T15:20:45.000Z",
      numeroProcesso: "00001234520234013201",
    },
    {
      nomeMovimento: "Conversão de Autos Físicos em Eletrônicos",
      descricaoMovimento: "O processo físico foi convertido para o formato eletrônico.",
      atualizacaoMovimento: "2020-08-05T01:15:18.000Z",
      numeroProcesso: "00001234520234013201",
    },
    {
      nomeMovimento: "Trânsito em Julgado",
      descricaoMovimento: "A decisão do processo transitou em julgado sem possibilidade de recurso.",
      atualizacaoMovimento: "2021-02-10T08:30:00.000Z",
      numeroProcesso: "00001234520234013201",
    },
    {
      nomeMovimento: "Em Execução",
      descricaoMovimento: "O processo está em fase de execução.",
      atualizacaoMovimento: "2021-06-20T10:45:00.000Z",
      numeroProcesso: "00001234520234013201",
    },
  
    // Movimentos para o terceiro processo
    {
      nomeMovimento: "Distribuição",
      descricaoMovimento: "O processo foi distribuído e encaminhado para análise.",
      atualizacaoMovimento: "2018-10-30T14:06:24.000Z",
      numeroProcesso: "00009876520234013203",
    },
    {
      nomeMovimento: "Conclusão ao Juiz",
      descricaoMovimento: "O processo foi enviado ao juiz para decisão.",
      atualizacaoMovimento: "2019-02-15T09:30:00.000Z",
      numeroProcesso: "00009876520234013203",
    },
    {
      nomeMovimento: "Despacho",
      descricaoMovimento: "Juiz emitiu despacho sobre o andamento do processo.",
      atualizacaoMovimento: "2019-05-10T16:45:12.000Z",
      numeroProcesso: "00009876520234013203",
    },
    {
      nomeMovimento: "Audiência Realizada",
      descricaoMovimento: "Audiência ocorreu com as partes envolvidas.",
      atualizacaoMovimento: "2019-07-22T11:00:30.000Z",
      numeroProcesso: "00009876520234013203",
    },
    {
      nomeMovimento: "Sentença Proferida",
      descricaoMovimento: "Juiz proferiu a sentença do processo.",
      atualizacaoMovimento: "2019-12-05T15:20:45.000Z",
      numeroProcesso: "00009876520234013203",
    },
    {
      nomeMovimento: "Conversão de Autos Físicos em Eletrônicos",
      descricaoMovimento: "O processo físico foi convertido para o formato eletrônico.",
      atualizacaoMovimento: "2020-08-05T01:15:18.000Z",
      numeroProcesso: "00009876520234013203",
    },
    {
      nomeMovimento: "Trânsito em Julgado",
      descricaoMovimento: "A decisão do processo transitou em julgado sem possibilidade de recurso.",
      atualizacaoMovimento: "2021-02-10T08:30:00.000Z",
      numeroProcesso: "00009876520234013203",
    },
    {
      nomeMovimento: "Em Execução",
      descricaoMovimento: "O processo está em fase de execução.",
      atualizacaoMovimento: "2021-06-20T10:45:00.000Z",
      numeroProcesso: "00009876520234013203",
    },
  ];
  