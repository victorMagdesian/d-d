// src/utils/gameLogic.js

/**
 * Função que simula a execução de uma ação durante o jogo.
 * @param {string} action - A ação escolhida ("Atacar", "Defender", "Usar Item", etc.)
 * @param {object} gameState - O estado atual do jogo.
 * @param {object} payload - Dados adicionais (ex.: modificadores ou informações da ficha do jogador).
 * @returns {object} - Um objeto contendo o novo estado do jogo e uma mensagem descritiva.
 */
export function executeAction(action, gameState, payload = {}) {
    // Cria uma cópia do estado atual para não modificar diretamente
    let newGameState = { ...gameState };
    let message = '';
  
    switch (action) {
      case 'Atacar': {
        // Rola um dado de 20 faces para o ataque
        const { total, rolls } = rollDice(1, 20);
        const attackRoll = rolls[0];
        // Exemplo de modificador: se houver payload.modifier, adicione-o à rolagem
        const modifier = payload.modifier || 0;
        const finalAttack = attackRoll + modifier;
  
        if (attackRoll === 20) {
          // Acerto Crítico: dano dobrado
          const { total: damage, rolls: damageRolls } = rollDice(1, 8); // Ex.: dano de 1d8
          const critDamage = damage * 2;
          newGameState.enemyHealth = Math.max(0, newGameState.enemyHealth - critDamage);
          message = `Ataque Crítico! Rolagem: ${attackRoll} + ${modifier} = ${finalAttack}. Rolagem de dano: ${damageRolls.join(
            ', '
          )} → Dano dobrado: ${critDamage}. Vida do inimigo: ${newGameState.enemyHealth}.`;
        } else if (attackRoll === 1) {
          // Falha Crítica: ataque falhou
          message = `Falha Crítica! Rolagem: ${attackRoll} + ${modifier} = ${finalAttack}. O ataque não causou dano.`;
        } else {
          // Ataque normal
          const { total: damage, rolls: damageRolls } = rollDice(1, 8); // Ex.: dano de 1d8
          newGameState.enemyHealth = Math.max(0, newGameState.enemyHealth - damage);
          message = `Ataque normal! Rolagem: ${attackRoll} + ${modifier} = ${finalAttack}. Rolagem de dano: ${damageRolls.join(
            ', '
          )} → Dano: ${damage}. Vida do inimigo: ${newGameState.enemyHealth}.`;
        }
        break;
      }
      case 'Defender': {
        message = 'Você se defendeu com sucesso!';
        // Poderia implementar lógica para aumentar uma defesa temporária, por exemplo.
        break;
      }
      case 'Usar Item': {
        message = 'Você usou um item!';
        // Implemente a lógica para o efeito do item, como restaurar vida.
        break;
      }
      default: {
        message = 'Ação desconhecida.';
        break;
      }
    }
  
    return { newGameState, message };
  }
  
  // Função para rolar dados
export function rollDice(numDice = 1, numSides = 20) {
    let total = 0;
    let rolls = [];
    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * numSides) + 1;
      rolls.push(roll);
      total += roll;
    }
    return { total, rolls };
  }
  