# Finance Control

O Finance Control é uma aplicação para registrar entradas e despesas e acompanhar a movimentação do dinheiro ao longo dos meses. A proposta é servir tanto para organização financeira pessoal quanto como base de estudo para controles financeiros de pequenos negócios.

**[Acessar o projeto online](https://sgdavi488-cell.github.io/finance-control/)**

## O que já é possível fazer

- Registrar entradas e despesas com descrição, valor, data e categoria.
- Consultar o saldo, o total de entradas e o total de despesas do mês.
- Escolher o mês que deseja consultar.
- Visualizar uma comparação entre entradas e saídas em um gráfico.
- Pesquisar lançamentos por descrição ou categoria.
- Filtrar os registros por tipo.
- Excluir lançamentos.

## Armazenamento dos dados

Os lançamentos são salvos no LocalStorage do navegador. Não é necessário criar uma conta, mas os dados ficam vinculados ao navegador e ao dispositivo em que foram registrados.

Atualmente, o Finance Control não se conecta a bancos, não importa transações automaticamente e não sincroniza informações entre dispositivos. Também não oferece consultoria ou recomendações financeiras: é uma ferramenta de registro e visualização.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage API
- Elemento `dialog` do HTML para o formulário de lançamentos

O projeto foi desenvolvido sem framework JavaScript, mantendo a estrutura direta para facilitar o estudo e a manutenção.

## Estrutura principal

```text
finance-control/
├── index.html
├── styles.css
├── app.js
└── README.md
```

- `index.html`: estrutura da aplicação.
- `styles.css`: estilos e adaptação da interface.
- `app.js`: cadastro, armazenamento, filtros, cálculos e atualização da tela.

## Executar localmente

1. Baixe ou clone este repositório.
2. Abra a pasta no VS Code.
3. Inicie o `index.html` com Live Server ou outro servidor local.
4. Abra o endereço local no navegador e comece a registrar os lançamentos.

## Limitações atuais

- Os dados ficam salvos localmente no navegador.
- Não há login, banco de dados remoto ou integração bancária.
- Ainda não há exportação de lançamentos nem ferramenta de backup e restauração.
- O gráfico apresenta uma visão resumida das entradas e despesas do mês selecionado.

## Próximas ideias

- Exportar lançamentos para CSV.
- Criar orçamento por categoria.
- Adicionar metas mensais.
- Implementar backup e restauração dos dados.
- Estudar uma versão com backend e contas de usuário.

---

Projeto desenvolvido por Davi para praticar desenvolvimento web e construir uma forma simples de acompanhar finanças pessoais e de pequenos negócios.
