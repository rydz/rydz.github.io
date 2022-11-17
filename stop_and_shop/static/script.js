const UPLOAD_INTERVAL = 350
let PRODUCE_DB = {
  "4106": "apple, cortland",
  "4130": "apple, envy",
  "4126": "apple, fuji",
  "4135": "apple, gala",
  "4020": "apple, golden",
  "4017": "apple, granny",
  "3283": "apple, honeycrisp",
  "4019": "apple, macintosh",
  "4016": "apple, red",
  "4218": "apricots",
  "4516": "artichokes",
  "4080": "asparagus",
  "4225": "avocado",
  "424": "bagel/cream cheese",
  "1655": "bagels each",
  "4011": "bananas",
  "4066": "beans, green",
  "4060": "brocolli bnch",
  "4549": "mangoes",
  "4547": "brocolli raab",
  "4550": "brussel sprts",
  "89825": "bulk carrots",
  "4069": "cabbage",
  "4554": "cabbage, red",
  "4555": "cabbage, savoy",
  "4050": "cantaloupes",
  "4079": "cauliflower",
  "4257": "cherimoya",
  "4045": "cherries",
  "4927": "chestnuts",
  "4889": "cilantro",
  "4450": "clementines",
  "4261": "cocounuts",
  "700 ": "coffee med",
  "714": "coffee refill",
  "699": "coffee sm",
  "437": "condiment cup",
  "4078": "corn",
  "4062": "cucumbers",
  "4596": "cucumbers, english",
  "627": "cup coffee",
  "625": "danish/pastry",
  "620": "donuts each",
  "4081": "eggplant",
  "4543": "endive",
  "4608": "garlic",
  "4612": "ginger root",
  "3135": "gourds",
  "4281": "grapefruit, red",
  "4034": "honedew melon",
  "4625": "horseradish root",
  "99": "ice 10lb bag",
  "98": "ice 20 lb bag",
  "4627": "kale",
  "4030": "kiwi",
  "4303": "kumquat",
  "4629": "leeks",
  "4053": "lemons",
  "4632": "lettuce, boston",
  "4048": "limes",
  "402": "muffins each",
  "4085": "mushrooms",
  "4650": "mushrooms, port",
  "4378": "nectarines",
  "4082": "onions, red",
  "4663": "onions, white",
  "4665": "onions, yellow",
  "4012": "oranges",
  "4822 ": "parsley",
  "4044": "peaches",
  "4416": "pears, anjou",
  "4408": "pears, asian",
  "4409": "pears, bartlett",
  "4413": "pears, bosc",
  "4687": "peppers, cubanelle",
  "4065": "peppers, green",
  "4696": "peppers, hot",
  "4686": "peppers, mix chile",
  "4088": "peppers, red bell",
  "4235": "plantains",
  "4040": "plums",
  "3609": "pluot",
  "4127": "pomegranate",
  "4072": "potato, idaho",
  "4073 ": "potato, red",
  "4083": "potato, white",
  "4727": "potato, yellow",
  "3129": "pumello",
  "4736": "pumpkin, large",
  "4734": "pumpkin, mini",
  "4089": "radish",
  "4745": "rhubarb",
  "426": "rolls each",
  "94068": "scallions",
  "4662": "shallots",
  "4750": "squash, acorn",
  "4768": "squash, buttercup",
  "4759": "squash, butternut",
  "4067": "squash, green",
  "4776": "squash, spaghetti",
  "4782": "squash, yellow",
  "4801": "tomatillo",
  "4796": "tomato, cherry",
  "4087": "tomato, plum",
  "4664": "tomato, vine",
  "3151": "tomatoes large",
  "4812": "turnip",
  "3421": "watermelon, baby",
  "4032": "watermelon, whole",
  "4816": "yams/sweet potato",
  "4819": "yuca"
}

window.addEventListener("load", (async function() {
    let e_video_container = document.getElementById("video-container");

    /**@type {HTMLVideoElement} */
    let e_video = document.getElementById("video")
    let e_labels = document.getElementById("labels")
    let e_notice = this.document.getElementById("notice")
    /**@type {HTMLImageElement} */
    let e_preview = this.document.getElementById("preview")
    let e_produce_list_body = this.document.getElementById("produce-list-body")

    /**@type {HTMLInputElement} */
    let e_produce_search    = this.document.getElementById("produce-search")
    e_produce_search.addEventListener("keyup", function(event) {
        const key = e_produce_search.value.slice(-1).toLowerCase()
        e_produce_search.value = key

        const element = Array.from(e_produce_list_body.querySelectorAll("h3")).find(x => {
            let firstchild = x.firstChild;
            // console.log(firstchild)
            return firstchild.textContent.toLowerCase() == key
        })

        console.log("Found element... ")
        console.log(element)

        if (element) {
            console.log(element.offsetTop)
            element.scrollIntoView()
        }
    })

    let classifying = false

    /**
     * Open the rear facing camera and begin streaming
     */
    async function open_webcam() {
        const constraints = {
            video: {
                facingMode: "environment"
            },
        };

        return await navigator.mediaDevices.getUserMedia(constraints)
    }

    /**
     * Classify the object currently in the webcam's view and update the item classifier list
     */
    async function classify_webcam() {
        if (classifying) {
            return
        }
        classifying = true
        const loc = window.location;

        const canvas = document.createElement("canvas");
        canvas.width  = 256
        canvas.height = 256

        const context = canvas.getContext("2d")
        context.drawImage(e_video, 0, 0, 512, 512)

        const data_uri = canvas.toDataURL()
        // e_preview.src = data_uri

        try {
            const response = await fetch(
                `${loc.origin}/classify`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        data: data_uri,
                    })
                }
            )    
            /**@type {[String]} */
            json = await response.json()
            log(json.join("\n"))
            render_labels(json)
        } finally {
            classifying = false
        }

    }

    function log(str) {
        const p = document.createElement("p")
        p.innerHTML = str
        // document.getElementById("log").appendChild(p)
        document.getElementById("log").innerHTML = p.innerHTML
    }

    /**
     * Render the tags into the tag list table
     * @param {[[Number, Number]]} data 
     */
    function display_tags(data) {
    }

    /**
     * Render elements to a table
     * @param {String} code the produce code
     * @param {String} value the name of the produce
     */
    function render_tr(...values) {
       let tr = document.createElement("tr");
       values.forEach(/**@type {String}*/ x => {
            /**@type {String} x*/
            let v = x
            const el  = document.createElement("td");
            for (let color of [
                " green",
                " yellow",
                " blue",
                " purple",
                " red",
                " gold",
	        	" orange",
                " purple",
            ]) {
                if(v.toLowerCase()
                    .replace("granny", " green")
                    .replace("cucumbers", " green")
                    .replace("plums", " purple")
                    .replace("tomatoes large", " red")
		    .replace("pineapple", " yellow")
		    .replace("potato, sweet", " yellow")
                    .includes(color)) {
                    el.style.color = color;
                }
            }
            el.innerText = x;
            tr.appendChild(el)
       }) 
       return tr
    }


    let previous_valid_tag_stack = []
    /**
     * Render the produce list with the given tags 
     * @param {[String]} query 
     */
    async function render_labels(tags) {
        e_labels.innerHTML = ""
        let inserted = []
        for (let tag of tags) {
            for (let key of sorted_produce()) {
                /**@type {String} */
                const produce_name = PRODUCE_DB[key].toLowerCase()
                if (produce_name.includes(tag)) {
                    if (!previous_valid_tag_stack.includes(produce_name)) {
                        previous_valid_tag_stack.unshift(produce_name)
                    }
                    if (previous_valid_tag_stack.length >= 25) {
                        previous_valid_tag_stack.shift()
                    }
                    inserted.push(produce_name)
                    e_labels.appendChild(render_tr(key, produce_name))
                }
            }
        }
        e_labels.appendChild(render_tr("----------------", "--- previous entries---"))
        for (let tag of previous_valid_tag_stack) {
            if (inserted.includes(tag)) continue
            tag = tag.toLowerCase()
            e_labels.appendChild(
                render_tr(
                    get_code_from_name(tag),
                    tag,
                )
            )
        }
    }

    /**
     * 
     * @param {String} name 
     * @returns {String} product code
     */
    function get_code_from_name(name) {
        result = Object.entries(PRODUCE_DB).find(x => {
            return x[1].toLowerCase() == name.toLowerCase()
        });

        if (result) {
            return result[0]
        }
        return ""
    }

    function sorted_produce() {
        return Object.entries(PRODUCE_DB).sort((a, b) => {
            /**@param {[String, String]} a */
            return a[1].localeCompare(b[1])
        }).map(x => {
            return x[0];
        })
    }

    async function render_produce_list() {
        /**@type {object} */
        PRODUCE_DB = await (await fetch("static/produce_list.json")).json()

        e_produce_list_body.innerHTML = ""
        function gen_letter(x) {
            let letter = document.createElement("h3")
            letter.innerText = x
            return letter
        }

        let last_letter = ""
        let keys = Object.entries(PRODUCE_DB).sort((a, b) => {
            /**@param {[String, String]} a */
            return a[1].localeCompare(b[1])
        }).map(x => {
            return x[0];
        })
        for (code of keys) {
            v = PRODUCE_DB[code]
            if (v[0].toUpperCase() !== last_letter) {
                last_letter = v[0].toUpperCase()
                e_produce_list_body.appendChild(gen_letter(last_letter))
            }
            let row = render_tr(code, PRODUCE_DB[code])
            e_produce_list_body.appendChild(row)
        }
    }

    render_produce_list()

    // let video_stream = await open_webcam()
    // e_video.srcObject = video_stream

    // Remove the notice asking for camera permissions
    // e_notice.parentElement.removeChild(e_notice)

    // let classify_timer = window.setInterval(() => {
    //    classify_webcam()
    // }, UPLOAD_INTERVAL);
}));
