class Tree extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.listItem;
        this.menuDepth;
        this.tempMenuArrBuff;
        this.prevObArr;
        this.backOption;
        this.shadowRoot.innerHTML = `
        <style>

            .tree-item {
                position: relative;
                right: 0px;
                padding: 0.5rem;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                border-bottom: 1px solid #ccc;
                opacity: 1;
                transform: translateX(0rem);
            }

            .hide-next {
                opacity: 0;
                transform: translateX(5rem);
                transition: all 300ms;
            }

            .hide-previous {
                opacity: 0;
                transform: translateX(-3rem);
                transition: all 300ms;
            }

            .show {
                opacity:1;
                transform: translateX(0rem);
                transition: all 300ms;
            }
            
            .hide-back-btn {
                opacity: 0;
                pointer-events: none;
            }

            .show-back-btn {
                opacity: 1;
                pointer-events: click mouseenter mouseleave;
            }

            #backBtn {
                position: relative;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                background: rgba(0,0,0,0.25);
             }

             #backOption {
                 padding: 0.5rem;
                 
             }

            #main div{
                display: flex;
                flex-direction: column;
                position: relative;
                top: 0;
                left: 0px;
                height: 100px;
                width: auto;
                background: rgba(0,0,0,0.15);
                border-radius: 3px 3px 0px 0px;
                padding: 0.5rem;
                overflow-y: auto;
                overflow-x: hidden;
            };

        </style>
        
        <div>
            <section id = "main">
            <div></div>
            </section>
            <section id = "backBtn"> 
            </section>
        </div>
        `;

    }

    connectedCallback() {
        this.canvas = this.shadowRoot.querySelector('#main div');
        this.backCanvas = this.shadowRoot.querySelector('#backBtn');
    };


    //render not reacting to setTimout?
    _render(menuObjArr, clickedItem, backBoolean, event) {
        // console.log(this.menuDepth);
        // console.log(this.listItem);
        let selectedHTML;
        if (event) {
            selectedHTML = event.target;
        }
        if (Array.isArray(menuObjArr)) {

            this.listItem = [];
            this.tempMenuArrBuff.push(menuObjArr);

            this.canvas.innerHTML = ''; //this is prohiting some of the animations
            this.backCanvas.innerHTML = '';

            for (let i = 0; i < menuObjArr.length; i++) {

                let obj = menuObjArr[i];
                let label = menuObjArr[i].label;
                this.listItem[i] = document.createElement('span');
                this.listItem[i].textContent = label;
                this.listItem[i].setAttribute('menuItem', i);
                this.listItem[i].classList.add("tree-item");
                this.listItem[i].addEventListener('mouseenter', () => {
                    this.listItem[i].style.background = 'rgba(0,0,0,0.15)';
                    this.listItem[i].style.cursor = 'pointer';
                });
                this.listItem[i].addEventListener('mouseleave', () => { this.listItem[i].style.background = 'rgba(0,0,0,0.00)' });
                this.listItem[i].addEventListener('click', this._next.bind(this, obj.children, obj)); //obj.children is an array of objects. pass back to _render next menu on click
                this.canvas.appendChild(this.listItem[i]);


                //a boolean value is checked when an object is clicked. Returns whether back or next animation.
                if (this.menuDepth >= 1 && backBoolean == false) {
                    this.listItem[i].classList.add("hide-next");
                }
                if (backBoolean === true) {
                    this.listItem[i].classList.add("hide-previous");
                }
            }

            this.backOption = document.createElement('span');
            this.backOption.textContent = '< Back';
            this.backOption.setAttribute('id', 'backOption');
            this.backOption.addEventListener('mouseenter', () => {
                this.backOption.style.background = 'rgba(0,0,0,0.15)';
                this.backOption.style.cursor = 'pointer'
            });
            this.backOption.addEventListener('mouseleave', () => { this.backOption.style.background = 'rgba(0,0,0,0.00)' });
            this.backOption.addEventListener('click', this._back.bind(this));
            this.backOption.classList.add('hide-back-btn');
            this.backCanvas.appendChild(this.backOption);

            if (this.menuDepth >= 1) {
                this.backOption.classList.remove('hide-back-btn');
                this.backOption.classList.add('show-back-btn');
            }

        } else { //this means the user has reached the root.
            selectedHTML.style.border = '1px solid rgba(0,0,0,0.50)';
            this.setAttribute('value', JSON.stringify(clickedItem));
            this.menuDepth -= 1;
        }

    }

    _back(nextObArr, obj, event) {
        this.menuDepth -= 1;
        this.prevObArr = this.tempMenuArrBuff[this.menuDepth];
        this._showPrevious();
        this._render(this.prevObArr, null, true, event);
        this.tempMenuArrBuff.pop();
        this.tempMenuArrBuff.pop();
    };

    _next(nextObArr, obj, event) {
        this.menuDepth += 1;
        this._render(nextObArr, obj, false, event);
        this._hidePrev();
        this._showNext();
    };

    _showPrevious(el) {
        let self = this;
        setTimeout(function () { for (let i = 0; i < self.listItem.length; i++) { self.listItem[i].classList.remove('hide-previous') } }, 0);
        setTimeout(function () { for (let i = 0; i < self.listItem.length; i++) { self.listItem[i].classList.add('show') } }, 0);
    };


    _hidePrev(list) {
        let self = this;
        for (let i = 0; i < self.listItem[i].length; i++) {
            self.listItem[i].classList.remove('hide-next');
            self.listItem[i].classList.add('hide-previous');
        };
    }

    _showNext(t) {
        let self = this;

        setTimeout(function () {
            for (let i = 0; i < self.listItem.length; i++) {
                self.listItem[i].classList.remove('hide-previous')
                self.listItem[i].classList.add('show')
                self.listItem[i].classList.remove('hide-next')
            };
         }, 0);

    }

    open(menuObjArr) {
        this.menuDepth = 0;
        this.tempMenuArrBuff = [];
        this._render(menuObjArr, null);
    };
}

customElements.define('smd-tree', Tree);