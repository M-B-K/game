class Game {
   static instance

   constructor(rows, columns, playersCount) {
      if (Game.instance == null) Game.instance = this

      this.playersUI = document.querySelector(".players")
      this.playerNameUI = document.querySelector(".player-turn .name")
      this.playerTurnBgUI = document.querySelector(".player-turn .bg")
      this.resetgame = document.querySelector(".reset a")
      this.playerTurnBgUI.style.display = "block"
      this.resetgame.style.display = "block"

      this.events = {
         edgeFill: [],
         boxFill: [],
         playerSwitch: [],
         playerWin: [],
      }

      this.players = [
         { name: "MBK", color: "#23297A", filledBoxes: 0 },
         { name: "player 1", color: "#00FFEF", filledBoxes: 0 },
         { name: "player 2", color: "#AFEEEE", filledBoxes: 0 },
         { name: "player 3", color: "#1F4AB8", filledBoxes: 0 },
         { name: "player 4", color: "#ADD8E6", filledBoxes: 0 },
         { name: "player 5", color: "#5D8AA8", filledBoxes: 0 },

      ]

      let p = this.players.length - playersCount
      for (let i = 0; i < p; i++) this.players.pop()

      this.currentPlayerIndex = 0
      this.currentPlayer = this.players[this.currentPlayerIndex]

      this.board = new Board(rows, columns)

      this.isGameover = false

      this.addPlayersUI()
      this.updatePlayerNameUI()

      this.addEventListener("boxFill", () => this.onBoxFill())
      this.addEventListener("playerSwitch", () => this.onPlayerSwitch())
      this.addEventListener("playerWin", () => this.onPlayerWin())
   }

   onPlayerWin() {
      this.isGameover = true

      const player = this.players.reduce((prev, current) => {
         return prev.filledBoxes > current.filledBoxes ? prev : current
      })

      setTimeout(() => {
         let p0 = this.players[0].filledBoxes

         if (this.players.every((p) => p.filledBoxes == p0)) {
            this.playerNameUI.parentElement.textContent = "Nobody wins"
            this.playerTurnBgUI.classList.add("no-win")
            this.playerTurnBgUI.style.background = "#eaeaea"
         } else {
            this.playerNameUI.parentElement.textContent = `${player.name} wins`
            this.playerTurnBgUI.classList.add("win")
            this.playerTurnBgUI.styl.color = player.color
         }
      }, 100)
   }

   onPlayerSwitch() {
      this.updatePlayerNameUI()
   }

   onBoxFill() {
      this.currentPlayer.filledBoxes++
      this.updatePlayerScoreUI()
   }

   addPlayersUI() {
      this.players.forEach((player, index) => {
         const div = document.createElement("div")
         div.classList.add("player")

         const b = document.createElement("b")
         b.classList.add("filled-boxes")
         b.textContent = player.filledBoxes
         b.style.color = player.color
         this.players[index]["filledBoxesUI"] = b

         const span = document.createElement("span")
         span.textContent = player.name

         div.appendChild(b)
         div.appendChild(span)

         this.playersUI.appendChild(div)
      })
   }

   updatePlayerScoreUI() {
      this.currentPlayer.filledBoxesUI.innerText =
         this.currentPlayer.filledBoxes
   }

   updatePlayerNameUI() {
      this.playerNameUI.innerText = this.currentPlayer.name
      this.playerTurnBgUI.style.color = this.currentPlayer.color
   }

   eventExist(event) {
      return this.events.hasOwnProperty(event)
   }

   addEventListener(event, callback) {
      if (!this.eventExist(event)) {
         console.error(`${event} event is not defined`)
         return
      }

      this.events[event].push(callback)
   }

   removeEventListener(event, callback) {
      if (!this.eventExist(event)) {
         console.error(`${event} event is not defined`)
         return
      }
      this.events[event].splice(this.events[event].indexOf(callback), 1)
   }

   invokeEvent(event, args) {
      if (!this.eventExist(event)) {
         console.error(`${event} event is not defined`)
         return
      }
      this.events[event].forEach((callback) => callback(args))
   }

   switchPlayer() {
      if (!this.isGameover) {
         this.currentPlayerIndex =
            ++this.currentPlayerIndex % this.players.length
         this.currentPlayer = this.players[this.currentPlayerIndex]
         this.invokeEvent("playerSwitch")
      }
   }

   /*
	fillEdgesDefault(){
		// fill some edges by default:
		const boardData = [
			{ targetBox:[0,0], edgesToFill:"left,top,bottom" }, 
			{ targetBox:[0,1], edgesToFill:"top,bottom" }, 
			{ targetBox:[1,0], edgesToFill:"left,bottom" }, 
			{ targetBox:[1,1], edgesToFill:"bottom,right" }
		]
		boardData.forEach(data=>{
			let box = this.board.boxes[data.targetBox[0]][data.targetBox[1]]
			let edgePositions = data.edgesToFill.split(",")
			edgePositions.forEach(pos=>{
				let edge = box.getEdge(pos)
				this.board.onEdgeClick(box, edge)
			})
		})
	}
    */
}

///////////////////////////////////////////////////////////////////////

const settingsUI = document.querySelector(".settings")
const rowsInput = document.querySelector("#rows")
const columnsInput = document.querySelector("#columns")
const playersInput = document.querySelector("#players-count")
const startBtn = document.querySelector(".start-btn")

var game = null

startBtn.addEventListener("click", () => {
   const rows = clamp(rowsInput.value, 5, 30)
   const columns = clamp(columnsInput.value, 5, 30)
   const playersCount = clamp(playersInput.value, 2, 6)

   console.log(rows, columns, playersCount)

   game = new Game(rows, columns, playersCount)

   settingsUI.style.display = "none"
})

function clamp(value, min, max) {
   return Math.min(Math.max(value, min), max)
}

//game.fillEdgesDefault()
