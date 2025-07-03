const form = document.getElementById('formProduto');
const tabela = document.getElementById('tabelaProdutos');

async function carregarProdutos() {
  const resposta = await fetch('/produtos');
  const produtos = await resposta.json();

  tabela.innerHTML = '';

  // Filtra produtos válidos (que têm nome preenchido)
  produtos
    .filter(p => p.PRODUTO !== null && p.PRECO !== null)
    .forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.PRODUTO}</td>
        <td>R$ ${(p.PRECO || 0).toFixed(2)}</td>
        <td>${p.QUANTIDADE ?? '-'}</td>
        <td>${p.DESCRICAO ?? ''}</td>
        <td>
          <button class="edit" onclick="editarProduto(${p.ID}, '${p.PRODUTO}', ${p.PRECO}, ${p.QUANTIDADE}, '${p.DESCRICAO}')">Editar</button>
          <button class="delete" onclick="deletarProduto(${p.ID})">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('produtoId').value;
  const produto = document.getElementById('produto').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const descricao = document.getElementById('descricao').value.trim();

  if (!produto || isNaN(preco) || isNaN(quantidade)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const payload = { produto, preco, quantidade, descricao };

  if (id) {
    await fetch(`/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } else {
    await fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  form.reset();
  document.getElementById('produtoId').value = '';
  carregarProdutos();
});

function editarProduto(id, produto, preco, quantidade, descricao) {
  document.getElementById('produtoId').value = id;
  document.getElementById('produto').value = produto;
  document.getElementById('preco').value = preco;
  document.getElementById('quantidade').value = quantidade;
  document.getElementById('descricao').value = descricao;
}

async function deletarProduto(id) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    await fetch(`/produtos/${id}`, { method: 'DELETE' });
    carregarProdutos();
  }
}

carregarProdutos();
