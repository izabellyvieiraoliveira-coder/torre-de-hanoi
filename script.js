/**
 * LÓGICA DO JOGO: TORRE DE HANÓI
 * Disciplina: Matemática Discreta - UTFPR
 */

// Variáveis de controle de estado
let moveCount = 0;           // Contador de movimentos realizados pelo jogador
let minMovesPossible = 0;    // Armazena o cálculo da fórmula 2^n - 1
let totalDisks = 3;          // Quantidade de discos (padrão inicial: 3)

// Paleta de cores harmonizada (Muted/Aesthetic) para os discos
const colors = [
    '#A9C9FF', // Azul Pastel (Disco 1)
    '#C3B1E1', // Roxo Lavanda (Disco 2)
    '#FFCCAB', // Laranja Pêssego (Disco 3)
    '#B4C7B9', // Verde Chá
    '#D4A5A5', // Rosa Antigo
    '#9DB2BF', // Azul Aço Claro
    '#A084E8', // Violeta Soft
    '#8785A2'  // Roxo Acinzentado
];

/**
 * Função para iniciar ou reiniciar a partida.
 * Lê o número de discos e prepara o tabuleiro.
 */
function resetGame() {
    // Obtém o valor do input definido pelo usuário
    totalDisks = parseInt(document.getElementById('diskCount').value);
    moveCount = 0; // Zera os movimentos

    /**
     * MATEMÁTICA DISCRETA:
     * A fórmula do número mínimo de movimentos para resolver a Torre de Hanói é 2^n - 1.
     */
    minMovesPossible = Math.pow(2, totalDisks) - 1;
    
    // Atualiza o painel de estatísticas no HTML
    document.getElementById('minMoves').innerText = minMovesPossible;
    document.getElementById('currentMoves').innerText = moveCount;
    document.getElementById('message').innerText = "";
    
    // Limpa o conteúdo visual de todas as torres antes de reiniciar
    document.querySelectorAll('.tower').forEach(t => t.innerHTML = "");

    // Seleciona a torre inicial (Torre 1) para inserir os novos discos
    const tower1 = document.getElementById('tower1');
    
    // Loop para criar os discos do maior para o menor (ordem de empilhamento visual)
    for (let i = totalDisks; i > 0; i--) {
        const disk = document.createElement('div');
        disk.id = `disk${i}`;           // ID único para o sistema de drag-and-drop
        disk.className = 'disk';        // Classe para estilização CSS
        disk.draggable = true;          // Ativa a funcionalidade de arrastar do navegador
        
        // Define a largura proporcional ao tamanho do disco (i)
        disk.style.width = `${40 + (i * 15)}px`;
        disk.style.backgroundColor = colors[i - 1]; // Atribui cor da paleta
        
        // Salva o tamanho no dataset para facilitar a validação lógica no movimento
        disk.dataset.size = i;
        
        // Adiciona o evento de início de arrasto
        disk.ondragstart = drag;
        
        // Insere o disco na torre inicial
        tower1.appendChild(disk);
    }
}

/**
 * Evento necessário para permitir que um elemento seja solto (drop) em uma área.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Lógica disparada ao começar a arrastar um disco.
 */
function drag(ev) {
    const parent = ev.target.parentElement;
    
    /**
     * REGRA DO JOGO: 
     * Só permite arrastar o disco se ele for o último elemento (o topo) da torre.
     */
    if (parent.lastElementChild !== ev.target) {
        ev.preventDefault(); // Cancela o arrasto se não for o disco do topo
        return;
    }
    
    // Armazena o ID do disco que está sendo movido para recuperá-lo no 'drop'
    ev.dataTransfer.setData("text", ev.target.id);
}

/**
 * Lógica disparada ao soltar o disco em uma torre de destino.
 */
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const disk = document.getElementById(data);
    
    // Encontra a torre mais próxima do local onde o disco foi solto
    const targetTower = ev.target.closest('.tower');
    
    // Verifica qual é o disco que já está no topo da torre de destino
    const topDisk = targetTower.lastElementChild;

    /**
     * REGRA DO JOGO:
     * Não permite colocar um disco maior sobre um disco menor.
     */
    if (topDisk && parseInt(disk.dataset.size) > parseInt(topDisk.dataset.size)) {
        return; // Sai da função sem mover o disco e sem contar movimento
    }

    // Se passou na regra, move o disco para a torre de destino
    targetTower.appendChild(disk);
    
    // Incrementa e atualiza o contador de movimentos
    moveCount++;
    document.getElementById('currentMoves').innerText = moveCount;

    // Verifica se o jogo acabou (vitória ou erro de movimentos)
    checkGameStatus(targetTower.id);
}

/**
 * Verifica se as condições de vitória ou fim de jogo foram atingidas.
 */
/**
 * Verifica se as condições de vitória ou fim de jogo foram atingidas.
 */
function checkGameStatus(towerId) {
    const tower2 = document.getElementById('tower2');
    const tower3 = document.getElementById('tower3');
    const messageElement = document.getElementById('message');

    /**
     * CONDIÇÃO DE VITÓRIA ATUALIZADA:
     * O jogo termina com sucesso se TODOS os discos estiverem juntos 
     * na Torre 2 OU na Torre 3.
     */
    const venceuNaTorre2 = (tower2.childElementCount === totalDisks);
    const venceuNaTorre3 = (tower3.childElementCount === totalDisks);

    if (venceuNaTorre2 || venceuNaTorre3) {
        messageElement.style.color = "#ff85b3"; // Rosa do tema
        messageElement.innerText = `✨ Sucesso! Você concluiu em ${moveCount} movimentos! ✨`;
        disableDrags(); // Trava o jogo para evitar movimentos extras
        return; // Sai da função imediatamente, garantindo que NÃO vai dar Game Over
    }

    /**
     * CONDIÇÃO DE GAME OVER:
     * Só vai disparar se o jogador atingir/estourar o limite mínimo 
     * E a verificação de vitória acima tiver sido falsa.
     */
    else if (moveCount >= minMovesPossible) {
        messageElement.style.color = "#835d7c";
        messageElement.innerText = "Game Over! Você atingiu o número mínimo de movimentos sem completar a solução. 🎀";
        disableDrags(); // Opcional: trava o jogo também no Game Over
    }
}

/**
 * Desativa a possibilidade de arrastar discos após o fim do jogo.
 */
function disableDrags() {
    document.querySelectorAll('.disk').forEach(d => d.draggable = false);
}

// Inicializa o ambiente do jogo assim que o script é carregado
resetGame();
