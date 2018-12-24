import React, { Component } from "react";
import _ from "lodash";
import "./App.css";

class Cell extends Component {
  render() {
    return (
      <div
        key={this.props.cellKey}
        id={this.props.id}
        className={this.props.snakeClass}
      />
    );
  }
}

class Forest extends Component {
  DrawGrid = () => {
    let self = this;
    return _.map(_.range(900), function(i) {
      let id = i + 1;
      let snakeClass =
        self.props.snake.indexOf(id) > -1 ? "cell snake" : "cell";
      if (id === self.props.food) snakeClass = "cell food";
      return (
        <Cell
          snakeClass={snakeClass}
          key={"cell" + id}
          cellKey={"cell" + id}
          id={"cell" + id}
        />
      );
    });
  };

  render() {
    return <div className="forest">{this.DrawGrid()}</div>;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.speed = 200;
    this.score = 0;
    this.start = true;
    this.step = 1;
    this.mode = "Easy";
    this.gameOver = false;
    this.state = {
      snake: [1, 2, 3, 4, 5],
      food: parseInt(Math.random() * 900) + 1
    };
  }

  componentWillMount = () => {
    document.addEventListener("keydown", this.startGame);
  };

  walk = () => {
    this.start = false;
    let snake = this.state.snake;
    this.updateSpeedMode();
    if (this.gameOver) {
      clearInterval(this.SnakeInter);
    } else if (this.isGameOver()) {
      console.log("Game Over");
      this.gameOver = true;
      this.setState({ snake: snake });
    } else {
      snake.push(snake[snake.length - 1] + this.step);
      if (this.state.food !== snake[snake.length - 1]) {
        snake = snake.slice(1);
        this.setState({ snake: snake });
      } else {
        console.log("food Eat");
        this.score += 1;
        this.setState({
          snake: snake,
          food: parseInt(Math.random() * 900) + 1
        });
      }
    }
  };

  updateSpeedMode = () => {
    if (this.score > 10 && this.score < 20) {
      this.speed = 100;
      this.mode = "Medium";
      clearInterval(this.SnakeInter);
      this.SnakeInter = setInterval(this.walk, this.speed);
    }
    if (this.score > 20) {
      this.speed = 1;
      this.mode = "Hard";
      clearInterval(this.SnakeInter);
      this.SnakeInter = setInterval(this.walk, this.speed);
    }
  };
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
  startGame = e => {
    //console.log(e);
    if (e.key === "Enter") {
      if (this.gameOver) this.reset();
      clearInterval(this.SnakeInter);
      this.SnakeInter = setInterval(this.walk, this.speed);
    }
    if (e.key === "ArrowUp") {
      if (this.step !== 30) this.step = -30;
    }

    if (e.key === "ArrowDown") {
      if (this.step !== -30) this.step = 30;
    }

    if (e.key === "ArrowLeft") {
      if (this.step !== 1) this.step = -1;
    }

    if (e.key === "ArrowRight") {
      if (this.step !== -1) this.step = 1;
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
            ? "Press Enter to play"
            : this.gameOver
            ? ""
            : "Mode:" + this.mode}
        </h3>
      </div>
    );
  }
}

export default App;
