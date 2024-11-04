import { FortuneTiger } from '../core/fortuneTiger';
import { TransactionRepository } from '../data/transactionRepository';
import { PlayGame } from '../useCases/playGame';

// Instâncias necessárias
const game = new FortuneTiger();
const transactionRepository = new TransactionRepository();
const playGame = new PlayGame(game, transactionRepository);

// Função para iniciar o jogo
const startGame = () => {
    console.log('🎲 Bem-vindo ao Fortune Tiger! 🎲');
    askForBet();
};

// Função para solicitar uma aposta
const askForBet = () => {
    process.stdout.write('💰 Insira o valor da sua aposta: '); // Escreve no terminal sem nova linha

    process.stdin.once('data', (input) => {
        const betAmount = parseFloat(input.toString().trim()); // Lê a entrada

        if (isNaN(betAmount) || betAmount <= 0) {
            console.log('Por favor, insira um valor de aposta válido.');
            return askForBet(); // Repetir a solicitação em caso de entrada inválida
        }

        const transaction = playGame.execute(betAmount);
        console.log(`🎰 Resultado: ${transaction.result.join(', ')}`);
        console.log(`💰 Ganhos: R$ ${transaction.winnings.toFixed(2)}`);
        
        // Mostra a blockchain atualizada após cada aposta
        const blockchain = playGame.getBlockchain();
        console.log('Blockchain Atualizada:', JSON.stringify(blockchain, null, 2));

        // Pergunta se o usuário quer jogar novamente
        process.stdout.write('🎲 Deseja jogar novamente? (s/n): ');
        process.stdin.once('data', (answer) => {
            if (answer.toString().trim().toLowerCase() === 's') {
                askForBet(); // Chama a função novamente para mais apostas
            } else {
                console.log('Obrigado por jogar!');
                process.exit(0); // Encerra o processo
            }
        });
    });
};

// Inicia o jogo
startGame();
