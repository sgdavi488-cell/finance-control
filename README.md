# finance control / dinheiro sem drama.

Um painel simples para registrar o que entra, o que sai e entender o caminho do dinheiro durante o mês.

Não é um banco, não é uma planilha gigante e não tenta resolver sua vida com um gráfico colorido. É uma ferramenta pequena, direta e feita para funcionar.

## O que já dá para fazer

- Registrar entradas e despesas com data, valor e categoria.
- Ver o saldo do mês sem fazer conta na mão.
- Comparar entradas e saídas em um gráfico por período.
- Buscar lançamentos e filtrar por tipo.
- Excluir registros lançados por engano.
- Consultar meses anteriores.
- Usar no celular ou no computador.

## Por que fiz assim?

A ideia foi fugir daquela tela cheia de números que parece feita só para contador. O Finance Control tenta deixar o básico à vista: quanto entrou, quanto saiu e o que está acontecendo no mês.

Os dados ficam no LocalStorage do navegador. Isso deixa o projeto leve e dispensa cadastro, mas também significa que os lançamentos não são sincronizados entre dispositivos.

## Tecnologias

HTML semântico, CSS responsivo, JavaScript puro e LocalStorage. Sem framework por enquanto. Preferi construir a lógica na base e entender cada parte antes de adicionar mais ferramentas.

## Rodando localmente

1. Clone este repositório.
2. Abra a pasta no VS Code.
3. Inicie o index.html com Live Server ou outro servidor local.
4. Comece adicionando seus lançamentos.

## Próximas ideias

- Exportar lançamentos em CSV.
- Criar orçamento por categoria.
- Adicionar metas mensais.
- Permitir backup e restauração dos dados.
- Criar uma versão com backend e login.

> Projeto de estudo e portfólio. Os valores são inseridos pelo próprio usuário; o Finance Control não se conecta a bancos nem oferece recomendações financeiras.

---

**Feito por Davi.** Um projeto de cada vez, entendendo o que tem por trás de cada linha.
