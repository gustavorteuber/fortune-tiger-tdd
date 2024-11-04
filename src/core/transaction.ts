export interface Transaction {
  betAmount: number; // Valor da aposta
  result: string[]; // Resultados dos símbolos
  timestamp: string; // Data e hora da transação
  winnings: number; // Ganhos a partir da aposta
}
