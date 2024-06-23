const _api = "https://script.google.com/macros/s/AKfycbzijb1hkwaZ_IPRglRii2Qu1Zn_lDvVeqVdLI4erR4OWcB9EIyeSQPRVpQC9Lf_B59rQA/exec"

const average = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;

const median = arr => {
    const sorted = arr.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
        return sorted[middle];
    }
};

;(async ()=>{
    const apiData = await fetch(_api + location.search, {
        method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
    })
    const json = await apiData.json()
    if(json?.type !== "error"){
        createView(json)
    }else{
        //エラー処理
        alert("Failed to get lock")
        location.reload()
    }
})();

function createView(json){
    document.querySelector("title").textContent = json?.season
    const ranking = json.data.map(data=>({username: data[0], stack: data.slice(1), current: data[data.length - 1]}))
    .sort((a, b)=>b.current - a.current);
    
    const myUsername = new URLSearchParams(location.href).get("username")
    const myData = ranking.find(v=>v.username === myUsername)
    
    document.querySelector("#num>tspan").textContent = myData.current + "$"
    const text = document.querySelector("#num")
    let parentWidth = text.parentNode.getBoundingClientRect().width
    let textWidth = text.getBoundingClientRect().width
    text.style.fontSize = parseInt(text.style.fontSize) * parentWidth/textWidth*0.5 + "px"
    
    const currents = ranking.map(item => item.current)
    document.querySelector("#averageValue").textContent = average(currents)
    document.querySelector("#median").textContent = "median:" + median(currents)
    document.querySelector("#max").textContent = "max:" + Math.max(...currents)
    document.querySelector("#min").textContent = "min:" + Math.min(...currents)

    const chart = new Chart(document.querySelector("#chartCanvas"), {
        type: "line",
        data: {
            labels: myData.stack.map((_, i)=>i+"回目"),
            datasets: [
                {
                    label: "stack",
                    data: myData.stack,
                    borderColor: "#F2F7FA"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    })
    const chartParet = chart.canvas.parentNode;
    chartParet.style.width = "90%";
    chartParet.style.height = "100%";
    if(window.innerWidth < window.innerHeight){
        chartParet.style.maxWidth = "100vw";
        chartParet.style.maxHeight = "100vh";
    }
    const ratio = new Chart(document.querySelector("#ratioCanvas"), {
        type: "pie",
        data: {
            labels: ranking.map(item=>item.username),
            datasets: [{
                data: ranking.map(item=>item.current)
            }]
        }
    })
    const ratioParent = ratio.canvas.parentNode
    ratioParent.style.width = "100%"
    ratioParent.style.height = "100%"
    if(window.innerWidth < window.innerHeight){
        ratioParent.style.maxWidth = "100vw";
        ratioParent.style.maxHeight = "100vh";
    }

    console.log(ranking.map(item=>item.current))
    const rankingChart = new Chart(document.querySelector("#rankingCanvas"), {
        type: "bar",
        data: {
            labels: ranking.map(item=>item.username),
            datasets: [{
                label: "stack",
                data: ranking.map(item=>item.current),
                backgroundColor: "#F2F7FA"
            }]
        }
    })
    const rankingParent = rankingChart.canvas.parentNode
    rankingParent.style.width = "100%"
    rankingParent.style.height = "100%"

    let myRank = ranking.findIndex(v=>v.username === myUsername) + 1
    document.querySelector("#rank").textContent = myRank + "/" + ranking.length + " 位"

    let last = myData.stack[myData.stack.length - 2]
    document.querySelector("#rateValue").textContent = (myData.current/(last ? last : 1)*100).toFixed(2) + "%"

    //最終表示
    document.querySelector(".loader").classList.add("disable")
    document.querySelector("#main").classList.remove("disable")
}


;(()=>{
    class Bubble{
        constructor(){
            this.parent = document.body
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
})();

/* 
{
    "type": "stack",
    "season": "24'2Q",
    "data": [
        [
            "rikka",
            0
        ]
    ]
}

[
    {
        "username": "player2",
        "stack": [
            0,
            14,
            15
        ],
        "current": 15
    },
    {
        "username": "rikka",
        "stack": [
            0,
            15,
            3,
            8
        ],
        "current": 8
    },
    {
        "username": "player3",
        "stack": [
            0,
            100,
            20,
            4
        ],
        "current": 4
    }
]
*/

window.addEventListener('load', function() {
    if (performance.navigation.type === 1) {
        window.location.replace('../');
    }
});