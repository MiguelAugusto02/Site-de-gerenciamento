let total = 0;
let vendas = [];
window.onload = function () {
    let dadosSalvos = localStorage.getItem("vendas");
    if (dadosSalvos) {
        vendas = JSON.parse(dadosSalvos);
        atualizarTela();
    }
}
function adicionar(nome, valor) {
    let agora = new Date();
    let venda = {
        produto: nome,
        preco: valor,
        dataISO: agora.toISOString()
    };
    vendas.push(venda);
    salvar();
    atualizarTela();
}
function atualizarTela() {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";
    total = 0;
    vendas.forEach(function (venda) {
        let dataObj = new Date(venda.dataISO);
        let dataFormatada = dataObj.toLocaleString("pt-BR");
        let item = document.createElement("li");
        item.innerText =
            venda.produto +
            " - R$ " + venda.preco.toFixed(2) +
            " | " + dataFormatada;
        lista.appendChild(item);
        total += venda.preco;
    });
    document.getElementById("total").innerText = total.toFixed(2);
}
function salvar() {
    localStorage.setItem("vendas", JSON.stringify(vendas));
}
function limpar() {
    if (confirm("Tem certeza que deseja apagar TODO o histórico?")) {
        vendas = [];
        salvar();
        atualizarTela();
    }
}
function exportarCSV() {
    if (vendas.length === 0) {
        alert("Não há vendas para exportar.");
        return;
    }
    let totalGeral = 0;
    let dados = vendas.map(function (venda) {
        let dataObj = new Date(venda.dataISO);
        totalGeral += venda.preco;

        return {
            Produto: venda.produto,
            "Preço (R$)": venda.preco,
            Data: dataObj.toLocaleDateString("pt-BR"),
            Hora: dataObj.toLocaleTimeString("pt-BR")
        };
    });
    dados.push({});
    dados.push({
        Produto: "TOTAL GERAL",
        "Preço (R$)": totalGeral
    });
    let ws = XLSX.utils.json_to_sheet(dados);
    ws["!cols"] = [
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 }
    ];
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendas");
    XLSX.writeFile(wb, "historico_vendas.xlsx");
} 