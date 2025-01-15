document.addEventListener("DOMContentLoaded", () => {
    const balanceElement = document.getElementById("balance");
    const transactionForm = document.getElementById("transaction-form");
    const transactionHistory = document.getElementById("transaction-history");
    const expenseChartCanvas = document.getElementById("expense-chart");
    let transactions = [];
    let balance = 0;
  
    const chartData = {
      labels: ["Alimentação", "Transporte", "Lazer", "Outros"],
      datasets: [
        {
          label: "Despesas por Categoria",
          data: [0, 0, 0, 0],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  
    const expenseChart = new Chart(expenseChartCanvas, {
      type: "pie",
      data: chartData,
    });
  
    function updateBalance() {
      balanceElement.textContent = balance.toFixed(2);
    }
  
    function updateChart() {
      const expenseCategories = transactions
        .filter((t) => t.type === "expense")
        .reduce(
          (acc, curr) => {
            acc[curr.category] += curr.amount;
            return acc;
          },
          { alimentação: 0, transporte: 0, lazer: 0, outros: 0 }
        );
  
      chartData.datasets[0].data = [
        expenseCategories["alimentação"],
        expenseCategories["transporte"],
        expenseCategories["lazer"],
        expenseCategories["outros"],
      ];
  
      expenseChart.update();
    }
  
    function renderTransactions() {
      transactionHistory.innerHTML = "";
      transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.textContent = `${transaction.type === "income" ? "+" : "-"} R$${transaction.amount.toFixed(
          2
        )} (${transaction.category})`;
        li.style.color = transaction.type === "income" ? "green" : "red";
        transactionHistory.appendChild(li);
  
        li.addEventListener("click", () => {
          transactions.splice(index, 1);
          balance += transaction.type === "income" ? -transaction.amount : transaction.amount;
          updateBalance();
          updateChart();
          renderTransactions();
        });
      });
    }
  
    transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const type = document.getElementById("type").value;
      const category = document.getElementById("category").value;
      const amount = parseFloat(document.getElementById("amount").value);
  
      transactions.push({ type, category, amount });
      balance += type === "income" ? amount : -amount;
  
      updateBalance();
      updateChart();
      renderTransactions();
  
      transactionForm.reset();
    });
  
    updateBalance();
  });
  