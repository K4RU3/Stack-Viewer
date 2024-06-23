const Q = (arg)=>{return document.querySelector(arg)}
const _api = "https://script.google.com/macros/s/AKfycbzijb1hkwaZ_IPRglRii2Qu1Zn_lDvVeqVdLI4erR4OWcB9EIyeSQPRVpQC9Lf_B59rQA/exec"
let _seasonLoaded = _seasonLoading = false

Q("#username").value = localStorage.getItem("username")

Q("#seasonSelector").addEventListener("click", (e)=>{
	e.target.classList.add("loading")
	const list = Q("#seasonList")
	list.addEventListener("click", (clicked)=>{
		e.target.classList.remove("selected")
		list.classList.remove("show")
		e.target.textContent = clicked.target.textContent
	})
	//season loading
	const endLoad = ()=>{
		e.target.classList.remove("loading")
		e.target.classList.add("selected")
		list.classList.add("show")
	}
	if(!_seasonLoaded && !_seasonLoading){
		_seasonLoading = true
		api("?season").then(p=>p.json())
		.then(j=>{
			const seasons = j?.data
			if(seasons && Array.isArray(seasons)){
				seasons.forEach(s=>{
					let elem = document.createElement("div")
					elem.innerHTML = s
					list.appendChild(elem)
				})
			}
			_seasonLoaded = true
			_seasonLoading = false
			endLoad()
		})
	} else if(!_seasonLoading) endLoad()
})

Q("#modeSelector").addEventListener("click", (selector)=>{
	const list = Q("#modeList")
	list.classList.add("show")
})
document.querySelectorAll("#modeList>div").forEach(elem=>{
	elem.addEventListener("click", ()=>{
		let value = Q("#modeSelector").textContent = elem.textContent
		elem.parentNode.classList.remove("show")
		if(value !== "view"){
			Q("#calcVal").classList.remove("disable")
		}else{
			Q("#calcVal").classList.add("disable")
		}
	})
})

Q("#search").addEventListener("click", ()=>{
	const usernameElem = Q("#username")
	const name = usernameElem?.value
	let season = Q("#seasonSelector")?.textContent
	const mode = Q("#modeSelector")?.textContent
	const amountElem = Q("#calcVal")
	let amount = amountElem.value

	if(season === "latest") season = undefined

	if(!name){
		usernameElem.classList.add("shake")
		setTimeout(()=>{
			usernameElem.classList.remove("shake")
		}, 1000)
		return
	}

	if(mode !== "view" && !amount){
		amountElem.classList.add("shake")
		setTimeout(()=>{
			amountElem.classList.remove("shake")
		}, 1000)
		return
	}

	let query = "?stack&username=" + name
	if(season) query += "&season=" + season
	if(mode !== "view"){
		query += "&" + mode + "=" + amount
	}
	localStorage.setItem("username", name)
	window.location.href = "/view" + query
})

async function api(query){
	return await fetch(_api + query, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

class Bubble{
	constructor(){
		this.parent = document.querySelector("#background")
		this.bubble = document.createElement("div")
		this.bubble.classList.add("bubble")
		this.init()
	}

	init(){
		let x = window.innerWidth
		let y = window.innerHeight
		this.bubble.style.left = this.genRandom(x) + "px"
		this.bubble.style.bottom = this.genRandom(y) + "px"
		this.bubble.style.width = this.bubble.style.height = (this.genRandom(10)) + 10 + "px"
		this.bubble.style.opacity = 0
		this.changeCount = 0
		this.genRad()
		this.parent.insertBefore(this.bubble, this.parent.firstChild)
		this.show()
	}

	genRad(){
		this.bubble.style.borderRadius = (this.genRandom(10)+10) + "px " + (this.genRandom(10)+10) + "px " + (this.genRandom(10)+10) + "px " + (this.genRandom(10)+10) + "px"
	}

	genRandom(max){
		return parseInt(Math.random() * (max + 1))
	}

	show(){
		setTimeout(()=>{
			this.bubble.style.opacity = 1
			this.bubble.style.bottom = (parseInt(this.bubble.style.bottom, 10) + 200) + "px"
			this.interval = setInterval(()=>{
				this.genRad()
				this.changeCount++
				if(this.changeCount > 10){
					clearInterval(this.interval)
					this.parent.removeChild(this.bubble)
					setTimeout(()=>{
						this.init()
					}, 100)
				}
				if(this.changeCount === 9){
					this.bubble.style.opacity = 0
				}
			}, 1000)
		}, 1000)
	}
}

let bubblecount = 0
const maxBubble = 100 / window.devicePixelRatio
let bubbleinterval = setInterval(()=>{
	if(bubblecount < maxBubble){
		new Bubble()
		bubblecount++
	}else{
		clearInterval(bubbleinterval)
	}
}, 100)