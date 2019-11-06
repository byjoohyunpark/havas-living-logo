<template>
  <div id="app">
    <form @submit="addQuote">
      <h2>Add a quote</h2>
      <label>
        <textarea placeholder="quote" v-model="quote" type="text" name="quote" required />
        </label>
            <label>
                <input placeholder="author" v-model="author" type="text" name="author" required />
            </label>
            <button @click="addQuote" :disabled="isEmpty(this.author) || isEmpty(this.quote)">Add Quote</button>
        </form>
        <ul v-if='quoteList'>
            <li v-for="(quote,key) in quoteList" :key="quote.id" :class="{'checked':quote.isVisible}">
                <label class="checkbox-container">
                  <input @click="showQuote(quote)" type="checkbox" :checked="quote.isVisible" >
                  <span class="checkmark"></span>
                </label>

                <div>
                {{quote.quote}}
                <br />by:{{quote.author}}
                </div>
                <button @click="deleteQuote(quote,this)">Delete Quote</button>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {
            quotes: [],
            author: '',
            quote: '',
            endpoint: 'https://hxc-screensaver.tech4.ny.havasww.com/quotes'
        }
    },
    components: {},
    computed: {
        quoteList() {
            if (!this.quotes)
                return null
            const withID = this.quotes.map((q, i) => {
                q.id = i
                return q
            })
            if (withID)
                return withID.reverse()
            else return null
        }
    },
    methods: {
        isEmpty(str) {
            return str.replace(/^\s+|\s+$/g, '').length == 0;
        },
        deleteQuote(quote) {
            if (confirm("Do you really want to delete this quote?")) {
                const id = quote.id
                // return
                fetch(`${this.endpoint}/${id}`, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Cache-Control": "no-cache"
                        },
                        method: "delete",
                    })
                    .then((resp) => resp.json()) // Transform the data into json
                    .then(data => {
                        this.quotes = data
                    })
                    .catch(err => console.log('ERROR', err));
            }
        },
        addQuote(e) {
            e.preventDefault()
            if (!this.author.length || !this.quote.length)
                return
            fetch(this.endpoint, {
                    body: `author=${this.author}&quote=${this.quote}`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                            "Cache-Control": "no-cache"
                    },
                    method: "post",
                })
                .then((resp) => resp.json()) // Transform the data into json
                .then((data) => {
                    this.quotes = data
                    this.quote = ""
                    this.author = ""
                })
                .catch(err => console.log('ERROR', err));


        },
        showQuote(quote) {
            const id = quote.id
            console.log(quote.id, event.target.checked)
            // return
            // return
            fetch(`${this.endpoint}/${id}`, {
                    body: `showQuote=${event.target.checked}`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Cache-Control": "no-cache"
                    },
                    method: "put",
                })
                .then((resp) => resp.json()) // Transform the data into json
                .then(data => {
                    console.log(data)
                    this.quotes = data
                })
                .catch(err => console.log('ERROR', err));
        }
    },
    mounted() {
        fetch(this.endpoint,{
                headers: {
                  "Cache-Control": "no-cache"
                }}
                )
            .then((resp) => resp.json()) // Transform the data into json
            .then((data) => {
                this.quotes = data
            })
    }
}
</script>
<style lang="scss">
html {
    box-sizing: border-box;
    font-size: 16px;
    font-family: monaco, Consolas, "Lucida Console", monospace;
}

*,
*:before,
*:after {
    box-sizing: inherit;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ol,
ul {
    margin: 0;
    padding: 0;
    font-weight: normal;
}

ol,
ul {
    list-style: none;
}

img {
    max-width: 100%;
    height: auto;
}
form{
    width:600px;
    max-width:90%;
    margin:auto;
    input, textarea{
        width:100%;
        font-size:20px;
    }
}
ul {
    width:1000px;
    max-width:90%;
    margin: auto;

    li {
        display: flex;
          align-items: center;
          justify-content: center;
        background: #b58080;
        margin-bottom: 5px;
        &.checked {
            background: #80b59f
        }
        div{
            padding:5px 0;
  flex-grow:1;
}
    }
}

/* Customize the label (the checkbox-container) */
.checkbox-container {
  position: relative;
  margin: 0 15px;
  cursor: pointer;
  user-select: none;
}

/* Hide the browser's default checkbox */
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: relative;
  display:block;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.checkbox-container input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: block;
}

/* Show the checkmark when checked */
.checkbox-container input:checked ~ .checkmark:after {
  display: block;
  border: solid white;
  border-width: 0 3px 3px 0;
}
.checkbox-container input:checked ~ .checkmark:before {
  display: none;
}

/* Style the checkmark/indicator */
.checkbox-container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid red;
  border-width: 0 0 14px 0;
  transform: rotate(45deg);
}

/* Style the checkmark/indicator */
.checkbox-container .checkmark:before {
  content: "";
  position: absolute;
  display: block;
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid red;
  border-width: 0 0 14px 0;
  transform: rotate(-45deg);
}


</style>