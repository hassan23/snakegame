import React, { Component } from "react";
import _ from "lodash";
import "./App.css";

/**
 * @description create the grid on the screen on each interval with the position of snake
 * @class Forest
 * @extends {Component}
 */
class Forest extends Component {
  DrawGrid = () => {
    let self = this;
    return _.map(_.range(900), function(i) {
      // gird is 30 X 30
      let id = i + 1;
      let snakeClass =
        self.props.snake.indexOf(id) > -1 ? "cell snake" : "cell"; // cell snake class represents the presence of snake at that position
      if (id === self.props.food) snakeClass = "cell food";
      return <div className={snakeClass} key={"cell" + id} id={"cell" + id} />;
    });
  };

  render() {
    return <div className="forest">{this.DrawGrid()}</div>;
  }
}

/**
 * @description Main Snake Game class
 * @class App
 * @extends {Component}
 */
class Snake extends Component {
  constructor(props) {
    super(props);
    this.speed = 200; // default speed
    this.score = 0;
    this.start = true; // only true for the first game
    this.step = 1; // no of steps defines the direction (1 for right, -1 for left, 30 for down, -30 for up)
    this.mode = "Easy";
    this.gameOver = false;
    this.state = {
      snake: [1, 2, 3, 4, 5], // initial length of snake and in which cells of forest snake is in
      food: parseInt(Math.random() * 900) + 1 // cell no where food for snake is present
    };
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.startGame);
  };
  // this call responsible for snakes movement and food serving
  walk = () => {
    this.start = false;
    let snake = this.state.snake;

    this.updateSpeedMode(); // increase the speed if score crossed a limit

    if (this.gameOver) {
      clearInterval(this.SnakeInter); // stops the game
    } else if (this.isGameOver()) {
      console.log("Game Over");
      this.gameOver = true;
      this.setState({ snake: snake });
    } else {
      snake.push(snake[snake.length - 1] + this.step); // move the snake in certain direction
      if (this.state.food !== snake[snake.length - 1]) {
        snake = snake.slice(1);
        this.setState({ snake: snake });
      } else {
        console.log("food Eat");
        this.score += 1;
        let food = parseInt(Math.random() * 900) + 1;

        while (snake.indexOf(food) !== -1) {
          food = parseInt(Math.random() * 900) + 1;
        }

        this.setState({
          snake,
          food
        });
      }
    }
  };

  //updating the speed of snake
  updateSpeedMode = () => {
    if (this.score > 10 && this.score < 20) {
      this.speed = 100;
      this.mode = "Medium";
      clearInterval(this.SnakeInter);
      this.SnakeInter = setInterval(this.walk, this.speed);
    }
    if (this.score > 20) {
      this.speed = 50;
      this.mode = "Hard";
      clearInterval(this.SnakeInter);
      this.SnakeInter = setInterval(this.walk, this.speed);
    }
  };

  // cheking if snake hits the wall or make a loop
  isGameOver = () => {
    let snake = this.state.snake;
    if (snake.length !== _.uniq(snake).length) {
      console.log(1, snake);
      return true;
    } else {
      let snakeHead = snake[snake.length - 1];
      if (this.step === -1 && snakeHead % 30 === 1) {
        return true;
      } else if (this.step === 1 && snakeHead % 30 === 0) {
        return true;
      } else if (this.step === 30 && snakeHead > 900 - 30) {
        return true;
      } else if (this.step === -30 && snakeHead <= 30) {
        return true;
      } else {
        return false;
      }
    }
  };

  // restarting the whole game
  reset = () => {
    this.speed = 200;
    this.score = 0;
    this.step = 1;
    this.mode = "Easy";
    this.gameOver = false;
    this.setState({
      snake: [1, 2, 3, 4, 5],
      food: parseInt(Math.random() * 900) + 1
    });
  };

  // initiating and controlling the game throw key presses
  startGame = e => {
    //console.log(e);
    if (e.key === "Enter") {
      if (this.gameOver) this.reset();
      clearInterval(this.SnakeInter);
      this.SnakeInter = setInterval(this.walk, this.speed);
    }
    if (e.key === "ArrowUp") {
      if (this.step !== 30 && this.step !== -30) {
        this.step = -30;
        clearInterval(this.SnakeInter);
        this.SnakeInter = setInterval(this.walk, this.speed);
        this.walk();
      }
    } else if (e.key === "ArrowDown") {
      if (this.step !== -30 && this.step !== 30) {
        this.step = 30;
        clearInterval(this.SnakeInter);
        this.SnakeInter = setInterval(this.walk, this.speed);
        this.walk();
      }
    } else if (e.key === "ArrowLeft") {
      if (this.step !== 1 && this.step !== -1) {
        this.step = -1;
        clearInterval(this.SnakeInter);
        this.SnakeInter = setInterval(this.walk, this.speed);
        this.walk();
      }
    } else if (e.key === "ArrowRight") {
      if (this.step !== -1 && this.step !== 1) {
        this.step = 1;
        clearInterval(this.SnakeInter);
        this.SnakeInter = setInterval(this.walk, this.speed);
        this.walk();
      }
    }
  };

  render() {
    console.log(this.state.food);
    return (
      <div className="App">
        <h1>Snake Game</h1>
        <Forest snake={this.state.snake} food={this.state.food} />
        <div className="score">Score:{this.score}</div>
        <h4>{this.gameOver ? "Game Over: Press ENTER to play Again" : ""}</h4>
        <h3>
          {this.start
            ? "Welcome to the Snake Game: Press Enter to play"
            : this.gameOver
            ? ""
            : "Mode: " + this.mode}
        </h3>
      </div>
    );
  }
}

export default Snake;
