export class FortuneTiger {
  private readonly winnings: { [key: string]: number } = {
      '🐅🐅🐅': 10,  // Três tigres - 10x
      '💎💎💎': 5,   // Três diamantes - 5x
      '🔔🔔🔔': 3,    // Três sinos - 3x
      '🐅🐅💎': 2,   // Dois tigres e um diamante - 2x
  };

  public placeBet(betAmount: number): { result: string[], winnings: number } {
      const results = this.spinReels();
      const winnings = this.calculateWinnings(results, betAmount);
      return { result: results, winnings };
  }

  private spinReels(): string[] {
      const symbols = ['🐅', '💎', '🔔'];
      return Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
  }

  private calculateWinnings(results: string[], betAmount: number): number {
      const resultString = results.join('');
      return this.winnings[resultString] ? this.winnings[resultString] * betAmount : 0;
  }
}
