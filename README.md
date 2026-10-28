# 💰 Painel Financeiro — App Web de Finanças Pessoais

Este repositório contém o **Painel Financeiro**, um projeto pessoal de estudo desenvolvido com **HTML, CSS e JavaScript puro**, em um único arquivo e sem bibliotecas.
O app ajuda a controlar entradas e saídas, acompanhar o patrimônio e planejar uma meta de renda passiva, tudo direto no navegador.

> 🔒 Os dados ficam apenas no navegador de quem usa (`localStorage`). Nada é enviado para servidores.

# 🎯 Objetivo do Projeto

Criar uma ferramenta simples e gratuita que organize a vida financeira e mostre, na prática, quanto é preciso guardar para alcançar uma meta de longo prazo, ao mesmo tempo em que aplica conhecimentos de **Desenvolvimento de Sistemas**.

Entre os principais objetivos estão:

* Controlar **entradas e saídas** diárias e mensais;
* Acompanhar o **patrimônio** e os **aportes**;
* Simular o quanto é necessário guardar para uma **renda passiva** desejada;
* **Comparar investimentos** pelo rendimento líquido, já com Imposto de Renda;
* Praticar JavaScript puro, manipulação do DOM e armazenamento local.

# 🧩 Funcionalidades

* 📊 **Painel:** barra de progresso da meta, patrimônio atual, saldo do mês, gasto do dia e gráfico de evolução do patrimônio;
* 💸 **Entradas e saídas:** lançamentos por categoria, total do mês e gasto por dia;
* 🏦 **Aportes:** registro de aportes, rendimentos e retiradas;
* 🎯 **Simulador da meta:** patrimônio necessário e aporte mensal para chegar à renda desejada;
* ⚖️ **Comparador de investimentos:** compara opções (ex.: caixinha 100% do CDI vs CDB 102%) com rendimento bruto e líquido;
* 🌗 **Interface responsiva**, com modo claro e escuro automático.

# 🚀 Como usar

1. Baixe o arquivo `painel-financeiro.html`;
2. Abra no navegador com um duplo clique (funciona offline);
3. Registre seus lançamentos e aportes e ajuste a meta na aba **Simulador**.

# 🧮 Como os cálculos funcionam

**Simulador** (valores em reais de hoje, com retorno real, já descontada a inflação):

* Patrimônio necessário = `renda mensal × 12 ÷ retorno real anual`
* Taxa mensal equivalente: `i = (1 + r)^(1/12) − 1`
* Aporte mensal necessário: `(alvo − patrimônio atual × (1 + i)^n) ÷ [((1 + i)^n − 1) ÷ i]`, onde `n` é o número de meses

**Comparador:**

* Taxa diária do CDI: `(1 + CDI)^(1/252) − 1`, multiplicada pelo percentual do CDI da opção
* Dias úteis estimados: `dias × 252 ÷ 365` (aproximação)
* IR regressivo sobre o rendimento: 22,5% até 180 dias, 20% até 360, 17,5% até 720 e 15% acima

# 🛠️ Tecnologias utilizadas

![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)

![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

# 🗂️ Estrutura do código

Tudo está em `painel-financeiro.html`, organizado em blocos comentados:

| Bloco     | O que faz |
| --- | --- |
| `Dados`   | Estado do app (`S`), leitura e gravação no `localStorage` |
| `Abas`    | Navegação entre as telas |
| `Painel`, `Entradas e saídas`, `Aportes` | Renderização de cada aba |
| `Simulador`, `Comparador` | Cálculos financeiros |
| `Início`  | Valores iniciais e primeira renderização |

# ⚠️ Limitações

* O CDI do comparador é digitado manualmente e precisa ser atualizado;
* Os cálculos são aproximações para estudo. Confira taxas, liquidez, vencimento e cobertura do FGC no app do banco;
* Os dados não sincronizam entre aparelhos e são perdidos se o navegador for limpo;
* Não há conexão com bancos.

# 🌐 Publicar para outras pessoas

O arquivo é estático, então pode ser hospedado de graça no **GitHub Pages** ou no **Netlify**. Cada pessoa que abrir o link terá os próprios dados, guardados só no navegador dela.

# 🔭 Ideias para evoluir

* Importar extratos em CSV ou OFX;
* Criar contas de usuário com backend, para sincronizar entre aparelhos (com autorização verificada no servidor em toda requisição e dados isolados por usuário);
* Integrar Open Finance por meio de um agregador, respeitando a LGPD.

# 👩‍💻 Contato

- Laura Mancin
<a href="https://www.linkedin.com/in/laura-mancin-591561366" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
</a>

<a href="https://github.com/LauraMancin" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a>

<a href="https://mail.google.com/mail/?view=cm&to=lauramancin8@gmail.com" target="_blank">
  <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
</a>

# 📌 Observação

Este projeto é educacional. As simulações não são recomendação de investimento, e o retorno futuro é incerto. O conteúdo pode sofrer alterações conforme o avanço do projeto.