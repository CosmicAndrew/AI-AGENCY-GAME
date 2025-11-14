#!/usr/bin/env node

const readline = require('readline');

class AIAgencyGame {
  constructor() {
    this.money = 10000;
    this.reputation = 50;
    this.employees = 1;
    this.clients = 0;
    this.week = 1;
    this.gameOver = false;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  displayStats() {
    console.log('\n' + '='.repeat(50));
    console.log(`Week ${this.week} - AI Agency Dashboard`);
    console.log('='.repeat(50));
    console.log(`Money: $${this.money.toLocaleString()}`);
    console.log(`Reputation: ${this.reputation}/100`);
    console.log(`Employees: ${this.employees}`);
    console.log(`Active Clients: ${this.clients}`);
    console.log('='.repeat(50) + '\n');
  }

  displayMenu() {
    console.log('What would you like to do?');
    console.log('1. Take on a new client project ($5000, +10 reputation)');
    console.log('2. Hire an employee (-$3000/week, increases capacity)');
    console.log('3. Invest in marketing (-$2000, +15 reputation)');
    console.log('4. Train your team (-$1500, +5 reputation)');
    console.log('5. End week and collect payments');
    console.log('6. Quit game');
    console.log('');
  }

  async makeChoice() {
    return new Promise((resolve) => {
      this.rl.question('Enter your choice (1-6): ', (answer) => {
        resolve(answer.trim());
      });
    });
  }

  takeClient() {
    if (this.clients >= this.employees * 2) {
      console.log('\nYou don\'t have enough capacity! Hire more employees first.');
      return;
    }

    if (this.reputation < 30) {
      console.log('\nYour reputation is too low to attract clients!');
      return;
    }

    this.clients++;
    this.reputation += 10;
    console.log('\nGreat! You secured a new client project worth $5000!');
    console.log('The project will be completed at the end of the week.');
  }

  hireEmployee() {
    if (this.money < 3000) {
      console.log('\nNot enough money to hire an employee!');
      return;
    }

    this.money -= 3000;
    this.employees++;
    console.log('\nYou hired a new AI specialist! Your capacity has increased.');
  }

  investMarketing() {
    if (this.money < 2000) {
      console.log('\nNot enough money for marketing!');
      return;
    }

    this.money -= 2000;
    this.reputation += 15;
    if (this.reputation > 100) this.reputation = 100;
    console.log('\nMarketing campaign launched! Your reputation increased.');
  }

  trainTeam() {
    if (this.money < 1500) {
      console.log('\nNot enough money for training!');
      return;
    }

    this.money -= 1500;
    this.reputation += 5;
    if (this.reputation > 100) this.reputation = 100;
    console.log('\nTeam training completed! Skills and reputation improved.');
  }

  endWeek() {
    console.log('\n' + '='.repeat(50));
    console.log('End of Week Report');
    console.log('='.repeat(50));

    // Collect payments from clients
    const revenue = this.clients * 5000;
    console.log(`Client payments received: $${revenue.toLocaleString()}`);
    this.money += revenue;

    // Pay employee salaries
    const salaries = this.employees * 2000;
    console.log(`Employee salaries paid: -$${salaries.toLocaleString()}`);
    this.money -= salaries;

    // Operating costs
    const operatingCosts = 1000;
    console.log(`Operating costs: -$${operatingCosts.toLocaleString()}`);
    this.money -= operatingCosts;

    // Reputation decay if no clients
    if (this.clients === 0) {
      this.reputation -= 5;
      console.log('No active clients - reputation decreased by 5');
    }

    // Reset clients for next week
    this.clients = 0;

    this.week++;
    console.log('='.repeat(50));

    // Check game over conditions
    if (this.money <= 0) {
      console.log('\nGAME OVER! You ran out of money.');
      this.gameOver = true;
    } else if (this.reputation <= 0) {
      console.log('\nGAME OVER! Your reputation is ruined.');
      this.gameOver = true;
    } else if (this.week > 52) {
      console.log('\n='.repeat(50));
      console.log('CONGRATULATIONS! You survived a full year!');
      console.log(`Final Stats:`);
      console.log(`Money: $${this.money.toLocaleString()}`);
      console.log(`Reputation: ${this.reputation}/100`);
      console.log(`Employees: ${this.employees}`);
      console.log('='.repeat(50));
      this.gameOver = true;
    }
  }

  async play() {
    console.log('\n' + '='.repeat(50));
    console.log('Welcome to AI Agency Game!');
    console.log('='.repeat(50));
    console.log('Build and manage your own AI agency.');
    console.log('Goal: Survive 52 weeks (1 year) with positive cash flow.');
    console.log('='.repeat(50) + '\n');

    while (!this.gameOver) {
      this.displayStats();
      this.displayMenu();

      const choice = await this.makeChoice();

      switch (choice) {
        case '1':
          this.takeClient();
          break;
        case '2':
          this.hireEmployee();
          break;
        case '3':
          this.investMarketing();
          break;
        case '4':
          this.trainTeam();
          break;
        case '5':
          this.endWeek();
          break;
        case '6':
          console.log('\nThanks for playing! Goodbye.');
          this.gameOver = true;
          break;
        default:
          console.log('\nInvalid choice. Please enter a number between 1 and 6.');
      }
    }

    this.rl.close();
  }
}

// Start the game
const game = new AIAgencyGame();
game.play();
